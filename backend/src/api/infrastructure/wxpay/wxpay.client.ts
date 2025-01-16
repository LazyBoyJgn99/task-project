import { Injectable } from '@nestjs/common';
import { OrderTotal } from '@/api/domain/order/order.total.entity';

@Injectable()
export class WxpayClient {
  // 模拟支付，90%概率成功
  async createOrder(orderTotal: OrderTotal): Promise<string> {
    const mockPackage = `mock_prepay_${Date.now()}`;
    if (Math.random() < 0.9) {
      return mockPackage;
    }
    throw new Error('创建支付订单失败');
  }

  // 模拟退款，95%概率成功
  async refund(orderTotal: OrderTotal, refundAmount: number): Promise<boolean> {
    return Math.random() < 0.95;
  }

  // 模拟签名验证，始终返回true
  async verifySign(): Promise<boolean> {
    return true;
  }

  // 模拟解密，返回固定数据
  decipherGCM(): any {
    return {
      trade_state: 'SUCCESS',
      refund_status: 'SUCCESS',
      out_trade_no: 'mock_trade_no',
      out_refund_no: 'mock_refund_no'
    };
  }
}
