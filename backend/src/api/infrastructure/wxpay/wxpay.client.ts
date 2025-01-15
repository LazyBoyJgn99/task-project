import WxPay from 'wechatpay-node-v3';
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OrderTotal } from '@/api/domain/order/order.total.entity';
import configuration from 'config/configuration';

/**
 * 更多信息请参考
 * 支付结果通知：https://pay.weixin.qq.com/docs/merchant/apis/in-app-payment/payment-notice.html
 * 退款结果通知：https://pay.weixin.qq.com/docs/merchant/apis/in-app-payment/refund-result-notice.html
 */
interface IPaidDetail {
  /**
   * 支付状态
   * SUCCESS：支付成功
   */
  trade_state: string;

  /**
   * 退款状态
   * SUCCESS：退款成功
   */
  refund_status: string;

  /**
   * 商户系统内部订单号，总订单Id
   */
  out_trade_no: string;

  /**
   * 商户退款单号，对应子订单的退款单号
   */
  out_refund_no: string;
}

@Injectable()
export class WxpayClient {
  constructor(@Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay) {}

  async CreateOrderWX(orderTotal: OrderTotal): Promise<string> {
    const params = {
      description: `${orderTotal.user.name}的订单`,
      out_trade_no: orderTotal.id,
      notify_url: `${configuration.domain}/pos/order/pay/callback`,
      amount: {
        total: Math.round(orderTotal.price * 100),
      },
      payer: {
        openid: orderTotal.user.openId,
      },
    };
    const res = await this.wxPay.transactions_jsapi(params);
    if (res.status === 200) {
      return res.data.package;
    }
  }

  async RefundedOrderWX(orderTotal: OrderTotal, refundOrderTotal: OrderTotal) {
    const params = {
      out_trade_no: orderTotal.id,
      out_refund_no: refundOrderTotal.children[0].refundId,
      notify_url: `${configuration.domain}/pos/order/refunds/callback`,
      amount: {
        total: Math.round(orderTotal.price * 100),
        refund: Math.round(refundOrderTotal.price * 100),
        currency: 'CNY',
      },
    };
    const res = await this.wxPay.refunds(params);
    return res.status === HttpStatus.OK;
  }

  /**
   * 签名校验
   */
  verifySign(params: {
    timestamp: string | number;
    nonce: string;
    body: Record<string, any> | string;
    serial: string;
    signature: string;
    apiSecret?: string;
  }) {
    return this.wxPay.verifySign(params);
  }

  /**
   * 回调解密
   */
  decipher_gcm(
    ciphertext: string,
    associated_data: string,
    nonce: string,
    key?: string,
  ) {
    return this.wxPay.decipher_gcm<IPaidDetail>(
      ciphertext,
      associated_data,
      nonce,
      key,
    );
  }

  /**
   * 小程序调起支付签名计算
   */
  getSignature(
    appId: string,
    timeStamp: string,
    nonceStr: string,
    packageStr: string,
  ) {
    const str = [appId, timeStamp, nonceStr, packageStr, ''].join('\n');
    return this.wxPay.sha256WithRsa(str);
  }
}
