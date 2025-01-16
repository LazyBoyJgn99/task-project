import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, IsEnum, IsOptional } from 'class-validator';
import { UserRole, UserStatus, EnumGender } from '@/api/domain/user/user.entity';

export class LoginDto {
  @ApiProperty({ description: '手机号' })
  @IsPhoneNumber('CN')
  phone: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class UserQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ required: false })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class UserVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  createdAt: Date;
}

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  gender?: EnumGender;

  @ApiProperty({ required: false })
  @IsOptional()
  cityCode?: string;
}

export class UserLoginVo extends UserVo {
  openId: string;
  points: number;
  level: number;
  birthday?: string;
  gender?: EnumGender;
  cityCode?: string;
  accessToken?: string;
}
