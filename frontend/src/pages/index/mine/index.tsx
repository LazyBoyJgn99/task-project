import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Image } from '@tarojs/components';
import { IOrderTotal } from '@/types/order';
import { fetchUser, getUser } from '@/utils/user';
import { domain } from '@/utils/request';
import { useDidShow } from '@tarojs/taro';
import { ICoupon } from '@/types/coupon';
import { IGift } from '@/types/gift';
import { dealCouponsOrGifts } from '@/utils/price';
import request from '@/utils/request';
import CardUser from './components/card-user';
import RowDisplay from './components/row-display';
import Options from './components/options';
import './index.less';

export default function Index() {
  const barHeight = useSelector((state: any) => state.system.barHeight);
  const [user, setUser] = useState(getUser());
  const [orderTotals, setOrderTotals] = useState<IOrderTotal[]>([]);
  const [rewards, setRewards] = useState<ICoupon[] | IGift[]>([]);

  const requestForOrders = useCallback(async (userId: string) => {
    const orderTotals = await request.get<IOrderTotal[]>('/order', {
      userId,
    });
    setOrderTotals(orderTotals);
  }, []);

  const requestForRewards = useCallback(async (userId: string) => {
    const [coupons, gifts] = await Promise.all([
      request.get<ICoupon[]>('/coupon', {
        userId,
      }),
      request.get<IGift[]>('/gift', {
        userId,
      }),
    ]);
    const rewards = [...coupons, ...gifts];
    dealCouponsOrGifts(rewards);
    setRewards(rewards);
  }, []);

  useEffect(() => {
    if (user) {
      requestForOrders(user.id);
      requestForRewards(user.id);
      fetchUser(user.id).then((res) => setUser(res));
    }
  }, []);

  useDidShow(() => {
    const _user = getUser();
    if (_user) {
      fetchUser(_user.id).then((res) => setUser(res));
      requestForOrders(_user.id);
      requestForRewards(user.id);
    }
  });

  return (
    <View className="mine">
      <View style={{ height: `${barHeight}px`, width: '100%' }}></View>
      <CardUser user={user} />
      <View className="boundary-line">
        <Image src={`${domain}/images/boundary-line.png`}></Image>
      </View>
      <RowDisplay user={user} orderTotals={orderTotals} rewards={rewards} />
      <Options user={user} />
      <View className="empty"></View>
    </View>
  );
}
