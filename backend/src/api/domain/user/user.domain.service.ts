import { Injectable } from '@nestjs/common';
import { UserDao } from '@/api/infrastructure/user/user.dao';
import { Gift } from '../gift/gift.entity';
import { Coupon } from '../coupon/coupon.entity';
import { CouponDomainService } from '../coupon/coupon.domain.service';
import {
  DateToString,
  GetMonthStartAndEnd,
  NextMonthDate,
  OneYearLater,
  Today,
} from '@/utils/time';
import {
  GiftType,
  User,
  VIP_LEVEL_BIRTHDAY_REWARD_MAP,
  VIP_LEVEL_REWARD_MAP,
} from './user.entity';

@Injectable()
export class UserDomainService {
  constructor(
    private readonly userDao: UserDao,
    private readonly couponDomainService: CouponDomainService,
  ) {}

  async Add(user: User) {
    return await this.userDao.Save(user);
  }

  async DetailByOpenId(openId: string): Promise<User | null> {
    return await this.userDao.FindOneByOpenId(openId);
  }

  async QueryByIds(ids: Set<string>) {
    return await this.userDao.FindAllByIds([...ids]);
  }

  async Detail(id: string): Promise<User | null> {
    return await this.userDao.FindOne(id);
  }

  async DetailByPhone(phone: string): Promise<User | null> {
    return await this.userDao.FindOneByPhone(phone);
  }

  async Update(user: User) {
    return await this.userDao.Save(user);
  }

  /**
   * 当用户升级时发放升级奖励
   */
  async GenerateRewardForVIP(userId: string, level: number) {
    const user = await this.Detail(userId);
    const rewards: (Gift | Coupon)[] = [];
    const today = Today();
    const yearLater = OneYearLater();
    const canUseTime = `${DateToString(today)} to ${DateToString(yearLater)}`;
    VIP_LEVEL_REWARD_MAP[level].forEach(async (reward: Reward) => {
      if (reward.type === GiftType.GIFT) {
        const gift = new Gift();
        gift.name = reward.name;
        gift.user = user;
        gift.canUseTime = canUseTime;
        rewards.push(gift);
      } else if (reward.type === GiftType.COUPON) {
        const coupon = new Coupon();
        coupon.name = reward.name;
        coupon.user = user;
        coupon.strategy = reward.strategy;
        coupon.canUseTime = canUseTime;
        rewards.push(coupon);
      }
    });
    await this.userDao.GenerateReward(rewards);
  }

  /**
   * 自动发放生日优惠券
   */
  async GenerateBirthdayReward() {
    const startDate = NextMonthDate(0); // 当月1号
    const endDate = NextMonthDate(1); // endDate为下个月的1号
    const users = await this.userDao.FindAll();
    // 收集需要发放的生日优惠券
    const coupons: Coupon[] = [];
    users.forEach((user) => {
      if (!user.birthday) return;
      // 生日年份调整
      const birthday = new Date(user.birthday);
      birthday.setFullYear(startDate.getFullYear());
      // 判断是否在生成范围内
      if (birthday < startDate || birthday >= endDate) return;
      // 生成优惠券
      const coupon = GenetateBirthdayCoupon(user, birthday);
      if (coupon) coupons.push(coupon);
    });
    await this.couponDomainService.AddBatch(coupons);
  }

  /**
   * 当用户设置birthday时，判断是否发放生日优惠券
   */
  async CheckBirthdayRewardAndGenerate(user: User) {
    const startDate = NextMonthDate(0); // 当前月1号
    const endDate = NextMonthDate(1); // 下月1号
    // 生日年份调整到当前计算年份
    const birthday = new Date(user.birthday);
    birthday.setFullYear(startDate.getFullYear());
    // 判断生日是否在当月
    if (birthday >= startDate && birthday < endDate) {
      const coupon = GenetateBirthdayCoupon(user, birthday);
      if (coupon) await this.couponDomainService.Add(coupon);
    }
  }
}

const GenetateBirthdayCoupon = (user: User, birthday: Date) => {
  const reward = VIP_LEVEL_BIRTHDAY_REWARD_MAP[user.getLevel()];
  // 当会员等级为1级时没有优惠券生成
  if (!reward) return null;
  const { startOfMonth, endOfMonth } = GetMonthStartAndEnd(birthday);
  const coupon = new Coupon();
  coupon.name = reward.name;
  coupon.user = user;
  coupon.strategy = reward.strategy;
  coupon.canUseTime = `${DateToString(startOfMonth)} to ${DateToString(endOfMonth)}`;
  return coupon;
};

type Reward = {
  type: GiftType;
  name: string;
  strategy?: string;
};
