import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { WechatModule } from './wechat/wechat.module';
import { TianModule } from './tian/tian.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    UserModule,
    WechatModule,
    TianModule,
    WsModule,
  ],
  exports: [
    UserModule,
    WechatModule,
    TianModule,
    WsModule,
  ],
})
export class InfrastructureModule {}
