import { JwtService } from '@nestjs/jwt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ERROR_PASSWORD_NOT_CORRECT,
  ERROR_USER_ALREADY_EXISTS,
} from '@/common/constant';
import { UserDomainService } from '@/api/domain/user/user.domain.service';
import { WechatClient } from '@/api/infrastructure/wechat/wechat.client';
import { User } from '@/api/domain/user/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserAdapter } from './user.adapter';
import {
  ManagerLoginDto,
  UserDetailDto,
  UserLoginDto,
  UserLoginVo,
  UserRegisterDto,
  UserUpdateDto,
  UserVo,
} from './user.dto';

const hasRegisted = (user: User, phone: string, openId: string) => {
  return user.phone === phone && user.openId === openId;
};

const ManagerList = [
  {
    name: '小鹿本鹿',
    password: 'luLU1988',
    openId: 'oSN-r5ed-BvvwTaVPsGN4hc6RfYA',
  },
  {
    name: '虎虎虎',
    password: 'gofarm2011',
    openId: 'oSN-r5XcykyWAlhyn-Wl9GdTKuvU',
  },
];

@Injectable()
export class UserService {
  constructor(
    private readonly wechatClient: WechatClient,
    private readonly userDomainService: UserDomainService,
    private readonly userAdapter: UserAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async Detail(userDetailDto: UserDetailDto): Promise<UserVo> {
    const user = await this.userDomainService.Detail(userDetailDto.id);
    return user && this.userAdapter.ToVo(user);
  }

  async Update(userUpdateDto: UserUpdateDto) {
    const oldUser = await this.userDomainService.Detail(userUpdateDto.id);
    const newUser = this.userAdapter.ToEntityWhenUpdate(oldUser, userUpdateDto);
    await this.userDomainService.Update(newUser);
    // 如果是第一次修改生日，判断是否需要发放优惠券
    if (!oldUser.birthday && newUser.birthday) {
      await this.userDomainService.CheckBirthdayRewardAndGenerate(newUser);
    }
  }

  async QueryPhoneByPhoneCode(code: string): Promise<string> {
    return await this.wechatClient.GetUserPhoneByCode(code);
  }

  async QueryPhoneByLoginCode(code: string): Promise<string> {
    const openId = await this.wechatClient.GetUserOpenIdByCode(code);
    const user = await this.userDomainService.DetailByOpenId(openId);
    return user?.phone;
  }

  async RegisterAndLogin(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserLoginVo> {
    const openId = await this.wechatClient.GetUserOpenIdByCode(
      userRegisterDto.code,
    );
    await this.Register(userRegisterDto.phone, openId);
    return await this.LoginByOpenId(openId);
  }

  async Register(phone: string, openId: string): Promise<void> {
    const hasUser = await this.userDomainService.DetailByOpenId(openId);
    if (hasUser && hasRegisted(hasUser, phone, openId)) return;
    if (hasUser && hasUser.phone !== phone) {
      throw new InternalServerErrorException(ERROR_USER_ALREADY_EXISTS);
    }
    const user = this.userAdapter.ToEntityWhenRegister(phone, openId);
    await this.userDomainService.Add(user);
  }

  async Login(userLoginDto: UserLoginDto): Promise<UserLoginVo> {
    const openId = await this.wechatClient.GetUserOpenIdByCode(
      userLoginDto.code,
    );
    return await this.LoginByOpenId(openId);
  }

  async ManagerLogin(managerLoginDto: ManagerLoginDto) {
    const openId = ManagerList.find(
      (item) => item.password === managerLoginDto.password,
    )?.openId;
    if (!openId)
      throw new InternalServerErrorException(ERROR_PASSWORD_NOT_CORRECT);
    return await this.LoginByOpenId(openId);
  }

  async LoginByOpenId(openId: string): Promise<UserLoginVo> {
    const user = await this.userDomainService.DetailByOpenId(openId);
    if (!user) throw new InternalServerErrorException('user do not exist');
    const accessToken = await this.jwtService.signAsync({
      ...user,
      points: user.points.toString(),
    });
    return this.userAdapter.ToVo(user, accessToken);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async GenerateBirthdayRewardEveryMonth() {
    await this.userDomainService.GenerateBirthdayReward();
  }
}
