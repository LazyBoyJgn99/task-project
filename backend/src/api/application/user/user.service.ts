import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '@/api/domain/user/user.domain.service';
import { LoginDto } from './user.dto';
import { User, UserRole, UserStatus } from '@/api/domain/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 查找或创建用户
    let user = await this.userDomainService.findByPhone(loginDto.phone);
    if (!user) {
      user = new User();
      user.phone = loginDto.phone;
      user.name = `用户${loginDto.phone.slice(-4)}`;
      user.role = UserRole.CONSUMER;
      user.status = UserStatus.ACTIVE;
      user = await this.userDomainService.create(user);
    }

    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('账号已被禁用');
    }

    // 生成 token
    const payload = { 
      sub: user.id, 
      phone: user.phone,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }
}
