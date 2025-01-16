import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/domain/user/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDomainService } from '@/api/domain/user/user.domain.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { 
          expiresIn: config.get('jwt.expiresIn') 
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserDomainService],
  exports: [UserService, UserDomainService],
})
export class UserModule {}
