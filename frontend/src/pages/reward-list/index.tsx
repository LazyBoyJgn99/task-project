import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Empty, NavBar, Tabs } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import { ArrowLeft } from '@nutui/icons-react-taro';
import { ICoupon } from '@/types/coupon';
import { dealCouponsOrGifts, sortCouponsOrGifts } from '@/utils/price';
import { getUser } from '@/utils/user';
import { IGift } from '@/types/gift';
import request, { domain } from '@/utils/request';
import Taro, { useDidShow } from '@tarojs/taro';
import CardReward from './components/card-reward';
import './index.less';

const entryRender = (list: any[]) => {
  if (list.length) return list;
  return (
    <Empty
      image={<img src={`${domain}/images/empty.png`} alt="" />}
      title="暂无订单"
      description="小动物们正在赶来～">
      <View style={{ marginTop: '50px' }}>
        <Button
          type="primary"
          style={{ width: 200, height: 52, fontWeight: 600, fontSize: 18 }}
          onClick={() =>
            Taro.navigateTo({ url: '/pages/ticket-notice/index' })
          }>
          去购买
        </Button>
      </View>
    </Empty>
  );
};

export default function Index() {
  const user = getUser();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [gifts, setGifts] = useState<IGift[]>([]);

  useEffect(() => {
    requestForCoupon(user.id);
    requestForGift(user.id);
  }, []);

  useDidShow(() => {
    requestForCoupon(user.id);
    requestForGift(user.id);
  });

  /**
   * 获取用户所有的优惠券
   */
  const requestForCoupon = async (userId: string) => {
    const coupons = await request.get<ICoupon[]>('/coupon', {
      userId,
    });
    dealCouponsOrGifts(coupons);
    sortCouponsOrGifts(coupons);
    setCoupons(coupons);
  };

  /**
   * 获取用户所有的礼物
   */
  const requestForGift = async (userId: string) => {
    const gifts = await request.get<IGift[]>('/gift', {
      userId,
    });
    dealCouponsOrGifts(gifts);
    sortCouponsOrGifts(gifts);
    setGifts(gifts);
  };

  const barHeight = useSelector((state: any) => state.system.barHeight);

  return (
    <View className="reward-list">
      <View className="nav-bar">
        <View style={{ height: `${barHeight}px`, width: '100%' }}></View>
        <NavBar
          back={<ArrowLeft size={18} />}
          onBackClick={() => Taro.navigateBack()}>
          我的优惠券
        </NavBar>
      </View>
      <Tabs>
        <Tabs.TabPane title="线下使用">
          {entryRender(
            gifts.map((gift) => <CardReward key={gift.id} reward={gift} />)
          )}
        </Tabs.TabPane>
        <Tabs.TabPane title="线上使用">
          {entryRender(
            coupons.map((coupon) => (
              <CardReward key={coupon.id} reward={coupon} />
            ))
          )}
        </Tabs.TabPane>
      </Tabs>
    </View>
  );
}
