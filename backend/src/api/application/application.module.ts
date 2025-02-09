import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TianModule } from '../infrastructure/tian/tian.module';

@Module({
  imports: [
    UserModule,
    TianModule,
  ],
})
export class ApiModule {}
