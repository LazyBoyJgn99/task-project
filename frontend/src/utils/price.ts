import {
  EnumCouponStrategy,
  EnumTimeStatus,
  EnumUseStatus,
  ICoupon,
} from '@/types/coupon';
import { EnumCrowd, IBuyTicket, ITicket } from '@/types/ticket';
import { formatDate, getDate } from './time';
import { IGift } from '@/types/gift';

export function priceToString(price?: number) {
  if (!price) return '';
  return '¥ ' + (Math.round(price * 100) / 100).toFixed(2);
}

export function priceToStringDeformation(price?: number) {
  if (!price) return '¥ ---';
  return '¥ ' + (Math.round(price * 100) / 100).toFixed(2);
}

const computePriceByStrategy = (price: number, strategy: string) => {
  const [strategyType, discount, _, discountReduce] = strategy.split('-');
  if (strategyType === EnumCouponStrategy.DISCOUNT) {
    return price * ((100 - Number(discount)) / 100);
  } else if (strategyType === EnumCouponStrategy.FULL_DISCOUNT) {
    return Number(discountReduce);
  }
  return 0;
};

export const pickOutCoupon = (coupons: ICoupon[]) => {
  const sortCoupons = coupons
    .filter((item) => item._timeStatus === EnumTimeStatus.IN_TIME)
    .filter((item) => item.strategy.includes('discount'))
    .sort((a, b) => {
      const aPercentage = parseInt(a.strategy.split('-')[1]);
      const bPercentage = parseInt(b.strategy.split('-')[1]);
      return aPercentage - bPercentage;
    });
  return sortCoupons.length > 0 ? sortCoupons[0] : null;
};

export const pickOutTicket = (tickets: IBuyTicket[]) => {
  // 如果有成人票，优先优惠成人票
  const adultTickets = tickets.filter(
    (ticket) => (ticket.attribute.crowd = EnumCrowd.ADULT) && ticket.num > 0
  );
  if (adultTickets.length) return adultTickets[0];
  // 如果没有成人票，则优惠儿童票
  const childTickets = tickets.filter(
    (ticket) => (ticket.attribute.crowd = EnumCrowd.CHILD) && ticket.num > 0
  );
  if (childTickets.length) return childTickets[0];
  return null;
};

export const couponPrice = (tickets: IBuyTicket[], coupon?: ICoupon) => {
  if (!coupon) return 0;
  // 挑出要打折的票
  const ticket = pickOutTicket(tickets);
  if (ticket) return computePriceByStrategy(ticket.price, coupon.strategy);
  return 0;
};

export const getTimeStatus = (coupon: ICoupon | IGift) => {
  const [startDate, endDate] = coupon.canUseTime.split(' to ');
  const now = new Date();
  const startTime = getDate(`${startDate} 00:00:00`);
  const endTime = getDate(`${endDate} 23:59:59`);
  if (now < startTime) {
    return EnumTimeStatus.NOT_START;
  } else if (now > endTime) {
    return EnumTimeStatus.OVER_TIME;
  } else {
    return EnumTimeStatus.IN_TIME;
  }
};

const DISCOUNT_MAP = {
  '10': '一折',
  '20': '二折',
  '30': '三折',
  '40': '四折',
  '50': '五折',
  '60': '六折',
  '70': '七折',
  '80': '八折',
  '85': '八五折',
  '90': '一折',
};

export const discountFormat = (strategy: string) => {
  const [strategyType, discount, _, discountReduce] = strategy.split('-');
  if (strategyType === EnumCouponStrategy.DISCOUNT) {
    return DISCOUNT_MAP[discount];
  } else if (strategyType === EnumCouponStrategy.FULL_DISCOUNT) {
    return `满${discount}减${discountReduce}`;
  }
};

const SORT_MAP = {
  [EnumTimeStatus.IN_TIME]: 3,
  [EnumTimeStatus.NOT_START]: 2,
  [EnumTimeStatus.OVER_TIME]: 1,
};

export const sortCouponsOrGifts = (rewards: ICoupon[] | IGift[]) => {
  rewards.sort((a, b) => SORT_MAP[b._timeStatus] - SORT_MAP[a._timeStatus]);
  rewards.sort((_, b) => (b.status === EnumUseStatus.UNUSED ? 1 : -1));
};

export const dealCouponsOrGifts = (rewards: ICoupon[] | IGift[]) => {
  rewards.forEach((reward) => {
    reward._startTime = formatDate(reward.canUseTime.split(' to ')[0]);
    reward._endTime = formatDate(reward.canUseTime.split(' to ')[1]);
    reward._timeStatus = getTimeStatus(reward);
  });
};

/**
 * 判断假日优享券能否使用
 * 需要在dealCouponsOrGifts后调用
 */
export const dealHolidayCoupons = (coupons: ICoupon[], tickets: ITicket[]) => {
  const canUseHolidayCoupon = tickets.some((ticket) =>
    ticket.name.includes('假期')
  );
  coupons.forEach((coupon) => {
    const isHolidayCoupon = REWARD_MAP.HOLIDAY(coupon.name);
    const isInTime = coupon._timeStatus === EnumTimeStatus.IN_TIME;
    if (isHolidayCoupon && isInTime && !canUseHolidayCoupon) {
      coupon._timeStatus = EnumTimeStatus.NOT_START;
    }
  });
};

export const REWARD_MAP = {
  BIRTHDAY: (rewardName: string) => /^生日(\d{1,2})折优惠券$/.test(rewardName),
  HOLIDAY: (rewardName: string) => '假日优享券' === rewardName,
  KEEPSAKE: (rewardName: string) => '限定纪念品' === rewardName,
  BADGE: (rewardName: string) => '会员徽章' === rewardName,
  BLINDBOX: (rewardName: string) => '纪念品盲盒' === rewardName,
  POLAROID: (rewardName: string) => '动物合影（拍立得）' === rewardName,
  DRINK: (rewardName: string) => '饮品券' === rewardName,
  ANNIVERSARY: (rewardName: string) => '周年活动门票' === rewardName,
};

export const descriptionMap = (rewardName = '') => {
  if (REWARD_MAP.BIRTHDAY(rewardName))
    return '会员生日折扣券，当日正价门票上直接抵扣，生日当月可用';
  if (REWARD_MAP.HOLIDAY(rewardName))
    return '节假日折扣券，当日正价门票上直接抵扣，特殊假期可用';
  if (REWARD_MAP.KEEPSAKE(rewardName))
    return '限定纪念品兑换券，有效期内持券码至GO FARM农场入口处兑换';
  if (REWARD_MAP.BADGE(rewardName))
    return '会员徽章兑换券，有效期内持券码至GO FARM农场入口处兑换';
  if (REWARD_MAP.BLINDBOX(rewardName))
    return '纪念品盲盒兑换券，有效期内持券码至GO FARM农场入口处兑换';
  if (REWARD_MAP.POLAROID(rewardName))
    return '动物合影兑换券，有效期内持券码至GO FARM农场入口拍立得留念';
  if (REWARD_MAP.DRINK(rewardName))
    return '饮品券，有效期内持券码至GO FARM农场咖啡厅兑换饮品';
  if (REWARD_MAP.ANNIVERSARY(rewardName))
    return '周年活动门票，GO FATM农场周年活动当日可持此券码入场';
};
