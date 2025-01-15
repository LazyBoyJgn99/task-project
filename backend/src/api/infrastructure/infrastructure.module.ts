import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WechatModule } from './wechat/wechat.module';
import { CommodityModule } from './commodity/commodity.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { WxpayModule } from './wxpay/wxpay.module';
import { TianModule } from './tian/tian.module';
import { WsModule } from './ws/ws.module';
import { GiftModule } from './gift/gift.module';

@Module({
  imports: [
    UserModule,
    WechatModule,
    CommodityModule,
    CouponModule,
    OrderModule,
    GiftModule,
    WxpayModule,
    TianModule,
    WsModule,
  ],
  exports: [
    UserModule,
    WechatModule,
    CommodityModule,
    CouponModule,
    OrderModule,
    GiftModule,
    WxpayModule,
    TianModule,
    WsModule,
  ],
})
export class InfrastructureModule {}
