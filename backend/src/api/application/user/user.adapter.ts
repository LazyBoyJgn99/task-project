import { Injectable } from '@nestjs/common';
import { User } from '@/api/domain/user/user.entity';
import { DateToString, NewDate } from '@/utils/time';
import { UserUpdateDto, UserLoginVo } from './user.dto';

@Injectable()
export class UserAdapter {
  ToEntityWhenRegister(phone: string, openId: string) {
    const user = new User();
    user.name = phone;
    user.phone = phone;
    user.openId = openId;
    user.points = 0;
    return user;
  }

  ToEntityWhenUpdate(oldUser: User, userUpdateDto: UserUpdateDto) {
    const user = new User();
    user.id = userUpdateDto.id;
    user.name = userUpdateDto.name;
    user.birthday = NewDate(userUpdateDto.birthday);
    user.gender = userUpdateDto.gender;
    user.cityCode = userUpdateDto.cityCode;
    user.phone = oldUser.phone;
    user.points = oldUser.points;
    user.openId = oldUser.openId;
    return user;
  }

  ToVo(user: User, accessToken?: string) {
    const userLoginVo = new UserLoginVo();
    userLoginVo.id = user.id;
    userLoginVo.name = user.name;
    userLoginVo.phone = user.phone;
    userLoginVo.openId = user.openId;
    userLoginVo.points = user.points;
    userLoginVo.level = user.getLevel();
    userLoginVo.birthday = DateToString(user.birthday);
    userLoginVo.gender = user.gender;
    userLoginVo.cityCode = user.cityCode;
    userLoginVo.accessToken = accessToken;
    return userLoginVo;
  }
}
