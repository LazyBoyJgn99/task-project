import { IUser } from './user';

export interface ICoupon {
  id: string;
  name: string;
  strategy: string;
  canUseTime: string;
  status: EnumUseStatus;
  user: IUser;
  _timeStatus: EnumTimeStatus;
  _startTime: string;
  _endTime: string;
}

export enum EnumTimeStatus {
  NOT_START = 'not_start',
  OVER_TIME = 'over_time',
  IN_TIME = 'in_time',
}

export enum EnumUseStatus {
  UNUSED = 'unused',
  USED = 'used',
}

export enum EnumCouponStrategy {
  DISCOUNT = 'discount',
  FULL_DISCOUNT = 'full',
}
