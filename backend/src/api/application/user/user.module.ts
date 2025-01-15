import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DomainModule } from '@/api/domain/domain.module';
import { InfrastructureModule } from '@/api/infrastructure/infrastructure.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAdapter } from './user.adapter';
import jwtConfig from '@/config/jwt';

@Module({
  controllers: [UserController],
  imports: [DomainModule, InfrastructureModule, JwtModule.register(jwtConfig)],
  providers: [UserService, UserAdapter],
  exports: [UserAdapter],
})
export class UserModule {}
