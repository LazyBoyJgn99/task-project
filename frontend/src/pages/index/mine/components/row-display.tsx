import { Button } from '@nutui/nutui-react-taro';
import { View, Text } from '@tarojs/components';
import { IUser } from '@/types/user';
import { setTabbarIndex } from '@/store/system-slice';
import { useDispatch } from 'react-redux';
import { EnumTimeStatus, EnumUseStatus, ICoupon } from '@/types/coupon';
import { IGift } from '@/types/gift';
import {
  computeOrderTotalStatus,
  EnumOrderTotalStatus,
  IOrderTotal,
} from '@/types/order';
import Taro from '@tarojs/taro';
import './row-display.less';

interface IProps {
  user: IUser;
  orderTotals: IOrderTotal[];
  rewards: ICoupon[] | IGift[];
}

const totalOrderNumber = (orderTotals: IOrderTotal[]) => {
  return orderTotals.reduce((pre, cur) => {
    computeOrderTotalStatus(cur);
    const count = [
      EnumOrderTotalStatus.USED,
      EnumOrderTotalStatus.UNUSED,
      EnumOrderTotalStatus.UNPAID,
      EnumOrderTotalStatus.REFUNDING,
      EnumOrderTotalStatus.REFUNDED,
    ].includes(cur._status);
    return count ? pre + 1 : pre;
  }, 0);
};

const totalRewardNumber = (rewards: ICoupon[] | IGift[]) => {
  let count = 0;
  rewards.forEach((reward) => {
    if (
      reward.status === EnumUseStatus.UNUSED &&
      reward._timeStatus !== EnumTimeStatus.OVER_TIME
    )
      count++;
  });
  return count;
};

export default function Index(props: IProps) {
  const { user, orderTotals, rewards } = props;
  const dispatch = useDispatch();
  const goOrderPage = () => {
    if (!user) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    dispatch(setTabbarIndex(2));
  };

  const goCouponPage = () => {
    if (!user) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    Taro.navigateTo({ url: '/pages/reward-list/index' });
  };

  return (
    <View className="mine-row-display">
      <View className="display-item display-item-left">
        <View className="title">我的订单</View>
        <View className="button-box">
          <View>
            <Text className="text-number">
              {user ? totalOrderNumber(orderTotals) : '--'}&nbsp;张
            </Text>
          </View>
          <Button size="small" onClick={goOrderPage}>
            去查看
          </Button>
        </View>
      </View>
      <View className="display-item display-item-right">
        <View className="title">我的优惠券</View>
        <View className="button-box">
          <View>
            <Text className="text-number">
              {user ? totalRewardNumber(rewards) : '--'}&nbsp;张
            </Text>
          </View>
          <Button size="small" onClick={goCouponPage}>
            去查看
          </Button>
        </View>
      </View>
    </View>
  );
}
