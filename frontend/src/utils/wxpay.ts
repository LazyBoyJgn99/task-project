import Taro from '@tarojs/taro';
import request from './request';

/**
 * 生成32位随机字符串
 */
function generateNonceStr() {
  const timestamp = Date.now().toString(36); // 当前时间戳，转换为36进制
  const randomString = Math.random().toString(36).substring(2); // 随机数，转换为36进制
  return (timestamp + randomString).substring(0, 32); // 保证长度为32位
}

/**
 * 获取签名
 */
async function requestSign(
  timeStamp: string,
  nonceStr: string,
  packageStr: string
): Promise<string> {
  return await request.post('/order/pay/sign', {
    appId: 'wx5db5b55eca56b771',
    timeStamp,
    nonceStr,
    package: packageStr,
  });
}

/**
 * 支付函数
 */
export async function payment(
  prepayId: string,
  onSuccess?: () => void,
  onFailed?: () => void
) {
  const timeStamp = new Date().getTime().toString();
  const nonceStr = generateNonceStr();
  const paySign = await requestSign(timeStamp, nonceStr, prepayId);
  Taro.requestPayment({
    timeStamp,
    nonceStr,
    package: prepayId,
    signType: 'RSA',
    paySign,
    success: function () {
      onSuccess && onSuccess();
    },
    fail: function () {
      onFailed && onFailed();
    },
  });
}

/**
 * 退款函数
 */
export async function refund(
  orderTotalId: string,
  orderIds: string[],
  onSuccess?: () => void,
  onFailed?: () => void
) {
  return await request
    .post('/order/refunds', {
      orderTotalId,
      orderIds,
    })
    .then(() => {
      onSuccess && onSuccess();
    })
    .catch(() => {
      onFailed && onFailed();
    });
}

/**
 * 取消函数
 */
export async function cancel(
  orderTotalId: string,
  onSuccess?: () => void,
  onFailed?: () => void
) {
  return await request
    .post('/order/cancel', {
      id: orderTotalId,
    })
    .then(() => {
      onSuccess && onSuccess();
    })
    .catch(() => {
      onFailed && onFailed();
    });
}
