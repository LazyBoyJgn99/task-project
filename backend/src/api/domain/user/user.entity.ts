// import { COUPON_MAP_VIP } from '../coupon/coupon.entity';
// import { GIFT_MAP_VIP } from '../gift/gift.entity';

// 类
export { User };
// 常量
// export { VIP_LEVEL_REWARD_MAP };
// 类型
export { EnumGender, GiftType };

class User {
  id: string;

  /**
   * 用户名
   */
  name: string;

  /**
   * 用户手机号
   */
  phone: string;

  /**
   * 微信用户唯一标识
   */
  openId: string;

  /**
   * 用户积分
   */
  points: number;

  /**
   * 生日
   */
  birthday: Date;

  /**
   * 性别
   */
  gender: EnumGender;

  /**
   * 城市编码
   */
  cityCode: string;

  /**
   * 计算会员等级
   */
  getLevel() {
    for (const level of VIP_LEVEL_CHECK_MAP) {
      if (level.check(this.points)) return level.level;
    }
  }

  /**
   * 累加积分
   */
  addPointsByPrice(price: number) {
    // 根据价格计算积分
    const points = price;
    const oldLevel = this.getLevel();
    this.points += points;
    const newLevel = this.getLevel();
    // 判断是否升级
    return newLevel > oldLevel;
  }

  clone() {
    const user = new User();
    user.id = this.id;
    user.name = this.name;
    user.phone = this.phone;
    user.openId = this.openId;
    user.points = this.points;
    return user;
  }
}
export enum UserRole {
  ADMIN = 'admin',     // 管理员
  CONSUMER = 'consumer', // 消费者
  WORKER = 'worker'    // 接单者
}

export enum UserStatus {
  ACTIVE = 'active',   // 正常
  BANNED = 'banned'    // 禁用
}

enum EnumGender {
  /**
   * 男
   */
  MALE = '男',

  /**
   * 女
   */
  FEMAL = '女',
}

const VIP_LEVEL = {
  LEVAL_4: 4,
  LEVAL_3: 3,
  LEVAL_2: 2,
  LEVAL_1: 1,
};

const VIP_LEVEL_CHECK_MAP = [
  {
    level: VIP_LEVEL.LEVAL_4,
    check: (points: number) => points >= 3000,
  },
  {
    level: VIP_LEVEL.LEVAL_3,
    check: (points: number) => points >= 1000,
  },
  {
    level: VIP_LEVEL.LEVAL_2,
    check: (points: number) => points >= 500,
  },
  {
    level: VIP_LEVEL.LEVAL_1,
    check: (points: number) => points >= 0,
  },
];

enum GiftType {
  GIFT = 'gift',
  COUPON = 'coupon',
}

// const VIP_LEVEL_REWARD_MAP = {
//   [VIP_LEVEL.LEVAL_4]: [
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_KEEPSAKE,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_VIP_BADGE,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_BLIND_BOX,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_GROUP_PHOTO,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_DRINK,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_DRINK,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_ACTIVITY_TICKET,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_ACTIVITY_TICKET,
//     },
//     {
//       type: GiftType.COUPON,
//       ...COUPON_MAP_VIP.COUPON_HOLIDAY_ENJOY,
//     },
//   ],
//   [VIP_LEVEL.LEVAL_3]: [
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_KEEPSAKE,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_VIP_BADGE,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_BLIND_BOX,
//     },

//     {
//       type: GiftType.COUPON,
//       ...COUPON_MAP_VIP.COUPON_HOLIDAY_ENJOY,
//     },
//   ],
//   [VIP_LEVEL.LEVAL_2]: [
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_KEEPSAKE,
//     },
//     {
//       type: GiftType.GIFT,
//       ...GIFT_MAP_VIP.GIFT_VIP_BADGE,
//     },
//   ],
//   [VIP_LEVEL.LEVAL_1]: [],
// };

// export const VIP_LEVEL_BIRTHDAY_REWARD_MAP = {
//   [VIP_LEVEL.LEVAL_4]: {
//     type: GiftType.COUPON,
//     ...COUPON_MAP_VIP.COUPON_PERCENTAGE_50,
//   },
//   [VIP_LEVEL.LEVAL_3]: {
//     type: GiftType.COUPON,
//     ...COUPON_MAP_VIP.COUPON_PERCENTAGE_70,
//   },
//   [VIP_LEVEL.LEVAL_2]: {
//     type: GiftType.COUPON,
//     ...COUPON_MAP_VIP.COUPON_PERCENTAGE_85,
//   },
//   [VIP_LEVEL.LEVAL_1]: null,
// };
