import { WeChatPayModule } from 'nest-wechatpay-node-v3';
import { Module } from '@nestjs/common';
import { WxpayClient } from './wxpay.client';
import wechatPayConfig from '@/config/wechat.pay';

/**
 * 用到了nest-wechatpay-node-v3和wechatpay-node-v3，详细文档请参考:
 * https://www.npmjs.com/package/wechatpay-node-v3
 * https://www.npmjs.com/package/nest-wechatpay-node-v3
 */

@Module({
  imports: [WeChatPayModule.registerAsync(wechatPayConfig)],
  providers: [WxpayClient],
  exports: [WxpayClient],
})
export class WxpayModule {}
