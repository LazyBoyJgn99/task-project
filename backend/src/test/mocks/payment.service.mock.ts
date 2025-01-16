export class MockPaymentService {
  async pay(amount: number, orderId: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    // 模拟支付成功率 90%
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `PAY_${Date.now()}_${orderId}`
      };
    } else {
      return {
        success: false,
        error: '支付失败，请重试'
      };
    }
  }

  async refund(amount: number, orderId: string, transactionId: string): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    // 模拟退款成功率 95%
    const isSuccess = Math.random() < 0.95;

    if (isSuccess) {
      return {
        success: true,
        refundId: `REFUND_${Date.now()}_${orderId}`
      };
    } else {
      return {
        success: false,
        error: '退款失败，请重试'
      };
    }
  }
} 