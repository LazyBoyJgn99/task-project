import { InternalServerErrorException } from '@nestjs/common';
import { CouponStatus } from './type';
import { User } from '../user/user.entity';

// 常量
export { COUPON_MAP_VIP };

export class Coupon {
  id: string;

  /**
   * 优惠券名称
   */
  name: string;

  /**
   * 用户
   */
  user: User;

  /**
   * 使用状态
   * unused：未使用 used：已使用
   */
  status: CouponStatus = CouponStatus.UNUSED;

  /**
   * 优惠策略
   * 打折：例 discount-70
   * 满减：例 full-100-reduce-30
   */
  strategy: string;

  /**
   * 适用时间
   * null表示所以时间通用
   * 例：2024-09-05 to 2024-10-05
   */
  canUseTime: string | null;

  /**
   * 判断优惠券是否可用
   */
  isAvailable() {
    // 是否已经使用
    if (this.status !== CouponStatus.UNUSED) return false;
    // 是否在适用时间范围内
    const startTime = new Date(`${this.canUseTime.split(' to ')[0]} 00:00:00`);
    const endTime = new Date(`${this.canUseTime.split(' to ')[1]} 23:59:59`);
    const now = new Date();
    const notInTime =
      this.canUseTime === null || now < startTime || now > endTime;
    return !notInTime;
  }

  /**
   * 使用优惠券，返回优惠后的价格
   * @param price 订单价格
   */
  UseCoupon = (price: number) => {
    // 用了优惠券，但检测出优惠券不可用的情况下要报错
    if (!this.isAvailable())
      throw new InternalServerErrorException(
        `Coupon ${this.id} is not available`,
      );
    const strategy = strategys.find((s) => s.rule.test(this.strategy));
    const newPrice = strategy?.computed(price, this.strategy) || price;
    // 如果价格计算失败报错
    if (newPrice < 0 || isNaN(newPrice)) {
      throw new InternalServerErrorException('coupon compute error');
    }
    // 设置优惠券已使用
    this.status = CouponStatus.USED;
    return newPrice;
  };

  /**
   * 设置优惠券为未使用
   */
  setUnused() {
    this.status = CouponStatus.UNUSED;
  }

  clone() {
    const coupon = new Coupon();
    coupon.id = this.id;
    coupon.name = this.name;
    coupon.user = this.user.clone();
    coupon.status = this.status;
    coupon.strategy = this.strategy;
    coupon.canUseTime = this.canUseTime;
    return coupon;
  }
}

export const strategys = [
  {
    title: '打折',
    rule: /^discount-(?:[0-9]|[0-9][0-9])$/,
    check: (strategy: string) => {
      const regex = /^discount-(?:[0-9]|[0-9][0-9])$/;
      return regex.test(strategy);
    },
    computed: (price: number, strategy: string) => {
      const discount = strategy.split('-')[1];
      return (price * parseInt(discount)) / 100;
    },
  },
  {
    title: '满减',
    rule: /^full-(\d+)-reduce-(\d+)$/,
    check: (strategy: string) => {
      const regex = /^full-(\d+)-reduce-(\d+)$/;
      // 满减的时候，满减的值必须大于减免的值
      if (regex.test(strategy)) {
        const match = strategy.match(regex);
        const full = parseInt(match[1], 10);
        const reduce = parseInt(match[2], 10);
        if (full >= reduce) {
          return true;
        }
      }
      return false;
    },
    computed: (price: number, strategy: string) => {
      const full = strategy.split('-')[1];
      const reduce = strategy.split('-')[3];
      if (price < parseInt(full)) return price;
      return price - parseInt(reduce);
    },
  },
];

/**
 * 会员优惠券映射
 */
const COUPON_MAP_VIP = {
  /**
   * 生日85折优惠券
   */
  COUPON_PERCENTAGE_85: {
    name: '生日85折优惠券',
    strategy: 'discount-85',
  },
  /**
   * 生日7折优惠券
   */
  COUPON_PERCENTAGE_70: {
    name: '生日7折优惠券',
    strategy: 'discount-70',
  },
  /**
   * 生日5折优惠券
   */
  COUPON_PERCENTAGE_50: {
    name: '生日5折优惠券',
    strategy: 'discount-50',
  },
  /**
   * 假日优享券
   */
  COUPON_HOLIDAY_ENJOY: {
    name: '假日优享券',
    strategy: 'discount-80',
  },
};
