import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WechatClient } from './wechat.client';

@Module({
  imports: [HttpModule],
  providers: [WechatClient],
  exports: [WechatClient],
})
export class WechatModule {}
