import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { IBuyTicket, ITicket } from '@/types/ticket';
import { getUser } from '@/utils/user';
import { EnumTimeStatus, EnumUseStatus, ICoupon } from '@/types/coupon';
import { Button, Checkbox } from '@nutui/nutui-react-taro';
import {
  couponPrice,
  dealCouponsOrGifts,
  dealHolidayCoupons,
  priceToStringDeformation,
  sortCouponsOrGifts,
} from '@/utils/price';
import request from '@/utils/request';
import CardCoupon from './components/card-coupon';
import Taro from '@tarojs/taro';
import './index.less';

export default function Index() {
  const user = getUser();
  const [tickets, setTickets] = useState<IBuyTicket[]>([]);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [currentCoupon, setCurrentCoupon] = useState<ICoupon>();
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    // 获取路由参数，门票数量和id
    const orderDetail = JSON.parse(router.params.detail as string);
    const couponId = router.params.couponId;
    Promise.all([
      requestForTickets(orderDetail),
      requestForCoupon(user.id),
    ]).then((resList) => {
      const [tickets, coupons] = resList;
      dealCouponsOrGifts(coupons); // 判断优惠券是否过期
      dealHolidayCoupons(coupons, tickets); // 假期优惠券特殊处理
      sortCouponsOrGifts(coupons); // 优惠券排序
      setCoupons(coupons);
      // 页面回显选中的优惠券
      if (couponId) {
        const coupon = coupons.find((coupon) => coupon.id === couponId);
        setCheckboxValue([couponId]);
        setCurrentCoupon(coupon);
      }
    });
  }, []);

  /**
   * 获取用户所有的优惠券
   */
  const requestForCoupon = async (userId: string) => {
    const coupons = await request.get<ICoupon[]>('/coupon', {
      userId,
    });
    return coupons;
  };

  /**
   * 获取订单涉及的门票信息
   */
  const requestForTickets = async (
    details: { id: string; number: number }[]
  ) => {
    const promiseList: Promise<IBuyTicket>[] = details.map(async (detail) => {
      const tickets = await request.get<ITicket[]>('/commodity', {
        id: detail.id,
      });
      return {
        ...tickets[0],
        num: detail.number,
      };
    });
    const tickets = await Promise.all(promiseList);
    setTickets(tickets);
    return tickets;
  };

  const onCheckboxChange = (value: string[]) => {
    const currentValue = value.length ? value.pop() : undefined;
    setCheckboxValue(currentValue ? [currentValue] : []);
    const coupon = coupons.find((coupon) => coupon.id === currentValue);
    setCurrentCoupon(coupon);
  };

  const confirm = () => {
    Taro.eventCenter.trigger('couponChoose', { coupon: currentCoupon });
    Taro.navigateBack();
  };

  return (
    <View className="coupon-use">
      <Checkbox.Group value={checkboxValue} onChange={onCheckboxChange}>
        {coupons
          .filter(
            (coupon) =>
              coupon.status === EnumUseStatus.UNUSED &&
              coupon.canUseTime !== EnumTimeStatus.OVER_TIME
          )
          .map((coupon) => (
            <CardCoupon key={coupon.id} value={coupon.id} coupon={coupon} />
          ))}
      </Checkbox.Group>
      <View className="bottom-box">
        <View className="total-price">
          <View>
            优惠：{' '}
            <Text className="total-price-number">
              {priceToStringDeformation(couponPrice(tickets, currentCoupon))}
            </Text>
          </View>
          <Button type="primary" onClick={confirm}>
            确认
          </Button>
        </View>
        <View className="empty"></View>
      </View>
    </View>
  );
}
