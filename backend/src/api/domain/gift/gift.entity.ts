import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../user/user.entity';

// 类
export { Gift };
// 常量
export { GIFT_MAP_VIP };
// 类型
export { GiftStatus };

class Gift {
  id: string;

  /**
   * 卡劵名称
   */
  name: string;

  /**
   * 卡劵状态
   */
  status: GiftStatus = GiftStatus.UNUSED;

  /**
   * 用户
   */
  user: User;

  /**
   * 适用时间
   * null表示所以时间通用
   * 例：2024-09-05 to 2024-10-05
   */
  canUseTime: string | null;

  /**
   * 判断礼物是否可用
   */
  isAvailable() {
    // 是否已经使用
    if (this.status !== GiftStatus.UNUSED) return false;
    // 是否在适用时间范围内
    const startTime = new Date(`${this.canUseTime.split(' to ')[0]} 00:00:00`);
    const endTime = new Date(`${this.canUseTime.split(' to ')[1]} 23:59:59`);
    const now = new Date();
    const notInTime =
      this.canUseTime === null || now < startTime || now > endTime;
    return !notInTime;
  }

  Use() {
    if (!this.isAvailable())
      throw new InternalServerErrorException(
        `Gift ${this.id} is not available`,
      );
    this.status = GiftStatus.USED;
  }
}

enum GiftStatus {
  /**
   * 未使用
   */
  UNUSED = 'unused',

  /**
   * 已使用
   */
  USED = 'used',
}

/**
 * 会员礼物映射
 */
const GIFT_MAP_VIP = {
  /**
   * 限定纪念品
   */
  GIFT_KEEPSAKE: {
    name: '限定纪念品',
  },
  /**
   * 会员徽章
   */
  GIFT_VIP_BADGE: {
    name: '会员徽章',
  },
  /**
   * 纪念品盲盒
   */
  GIFT_BLIND_BOX: {
    name: '纪念品盲盒',
  },
  /**
   * 动物合影（拍立得）
   */
  GIFT_GROUP_PHOTO: {
    name: '动物合影（拍立得）',
  },
  /**
   * 饮品券
   */
  GIFT_DRINK: {
    name: '饮品券',
  },
  /**
   * 周年活动门票
   */
  GIFT_ACTIVITY_TICKET: {
    name: '周年活动门票',
  },
};
