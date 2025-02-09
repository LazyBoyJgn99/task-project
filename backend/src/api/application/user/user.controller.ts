import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/decorator/public';
import { UserService } from './user.service';
import {
  CodeDto,
  ManagerLoginDto,
  UserDetailDto,
  UserLoginDto,
  UserLoginVo,
  UserRegisterDto,
  UserUpdateDto,
  UserVo,
} from './user.dto';

@Controller('user')
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('detail')
  @ApiOperation({ summary: '用户详情' })
  async Detail(@Query() userDetailDto: UserDetailDto): Promise<UserVo> {
    return await this.userService.Detail(userDetailDto);
  }

  @Patch()
  @ApiOperation({ summary: '更新用户' })
  async Update(@Body() userUpdateDto: UserUpdateDto) {
    await this.userService.Update(userUpdateDto);
  }

  @Public()
  @Get('phone/by-phone-code')
  @ApiOperation({ summary: '根据phoneCode获取用户手机号' })
  async QueryPhoneByPhoneCode(@Query() params: CodeDto): Promise<string> {
    return await this.userService.QueryPhoneByPhoneCode(params.code);
  }

  @Public()
  @Get('phone/by-login-code')
  @ApiOperation({ summary: '根据loginCode获取用户手机号' })
  async QueryPhoneByLoginCode(@Query() params: CodeDto): Promise<string> {
    return await this.userService.QueryPhoneByLoginCode(params.code);
  }

  @Public()
  @Post('register-login')
  @ApiOperation({ summary: '用户注册并登录' })
  async RegisterAndLogin(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserLoginVo> {
    return await this.userService.RegisterAndLogin(userRegisterDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async Login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginVo> {
    return await this.userService.Login(userLoginDto);
  }

  @Public()
  @Post('login-manager')
  @ApiOperation({ summary: '管理员登录' })
  async ManagerLogin(
    @Body() managerLoginDto: ManagerLoginDto,
  ): Promise<UserLoginVo> {
    return await this.userService.ManagerLogin(managerLoginDto);
  }
}
