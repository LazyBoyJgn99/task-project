import { EnumTimeStatus, EnumUseStatus } from './coupon';
import { IUser } from './user';

export interface IGift {
  id: string;
  name: string;
  canUseTime: string;
  status: EnumUseStatus;
  user: IUser;
  _timeStatus: EnumTimeStatus;
  _startTime: string;
  _endTime: string;
}
