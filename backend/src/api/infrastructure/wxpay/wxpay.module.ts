import { Module } from '@nestjs/common';
import { WxpayClient } from './wxpay.client';

@Module({
  providers: [WxpayClient],
  exports: [WxpayClient],
})
export class WxpayModule {}
