import {
  IsString,
  IsPhoneNumber,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumGender } from '@/api/domain/user/user.entity';

export class UserRegisterDto {
  @IsPhoneNumber('CN')
  @ApiProperty()
  phone: string;

  @IsString()
  @ApiProperty()
  code: string;
}

export class UserLoginDto {
  @IsString()
  @ApiProperty()
  code: string;
}

export class ManagerLoginDto {
  @IsString()
  @ApiProperty()
  password: string;
}

export class UserDetailDto {
  @ApiProperty({
    description: '用户Id',
  })
  @IsString()
  id: string;
}

export class CodeDto {
  @IsString()
  @ApiProperty()
  code: string;
}

export class UserVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  openId: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  gender: EnumGender;

  @ApiProperty()
  cityCode: string;
}

export class UserLoginVo extends UserVo {
  @ApiProperty()
  accessToken: string;
}

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDateString()
  birthday: string;

  @ApiProperty()
  @IsEnum(EnumGender)
  @IsOptional()
  gender: EnumGender;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cityCode: string;
}
