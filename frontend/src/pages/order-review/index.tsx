import Taro from '@tarojs/taro';
import request from '@/utils/request';
import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { IBuyTicket, ITicket } from '@/types/ticket';
import { Cell, Checkbox } from '@nutui/nutui-react-taro';
import { ArrowRight } from '@nutui/icons-react-taro';
import { payment } from '@/utils/wxpay';
import { formatDate } from '@/utils/time';
import {
  couponPrice,
  dealCouponsOrGifts,
  dealHolidayCoupons,
  pickOutCoupon,
  pickOutTicket,
  priceToStringDeformation,
} from '@/utils/price';
import { getUser } from '@/utils/user';
import { EnumUseStatus, ICoupon } from '@/types/coupon';
import ButtonOnce from '@/components/button-once';
import './index.less';

interface IOrderTotal {
  prepayId: string;
  price: number;
}

const goPrivacyPolicy = () => {
  Taro.navigateTo({ url: '/pages/clause-farm-notice/index' });
};

/**
 * 新增订单请求
 */
const requestForAddOrder = async (
  tickets: IBuyTicket[],
  userId: string,
  coupon?: ICoupon
): Promise<IOrderTotal> => {
  // 得到门票id列表
  const commodityList = tickets.flatMap((ticket) => {
    const tickets: { commodityId: string; couponId?: string }[] = [];
    for (let i = 0; i < ticket.num; i++) {
      tickets.push({
        commodityId: ticket.id,
        couponId: undefined,
      });
    }
    return tickets;
  });
  // 挑出要打折的优惠券并给commodity设置优惠券id
  if (coupon) {
    const ticket = pickOutTicket(tickets);
    const commodity = commodityList.find(
      (item) => item.commodityId === ticket?.id
    );
    if (commodity) commodity.couponId = coupon.id;
  }
  const orderTotal = await request.post<IOrderTotal>(
    '/order',
    {
      userId,
      chooseCommodityList: commodityList,
    },
    {
      errorMsg: '门票已售罄',
    }
  );
  return orderTotal;
};

export default function Index() {
  const [tickets, setTickets] = useState<IBuyTicket[]>([]);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [currentCoupon, setCurrentCoupon] = useState<ICoupon>();
  const user = getUser();

  const router = useRouter();
  useEffect(() => {
    // 获取路由参数，门票数量和id
    const orderDetail = JSON.parse(router.params.detail as string);
    requestForTickets(orderDetail);
    // 处理优惠券选择页的回传事件
    const handleCouponEvent = (data: { coupon: ICoupon }) => {
      setCurrentCoupon(data.coupon);
    };
    Taro.eventCenter.on('couponChoose', handleCouponEvent);
    return () => {
      Taro.eventCenter.off('couponChoose', handleCouponEvent);
    };
  }, []);

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
  };

  useEffect(() => {
    if (tickets.length) autoSelectionCoupon(user.id);
  }, [tickets]);

  /**
   * 自动选择优惠券
   */
  const autoSelectionCoupon = async (userId: string) => {
    const coupons = await request.get<ICoupon[]>('/coupon', {
      userId,
    });
    // 过滤掉已使用的优惠券
    const unUsedCoupons = coupons.filter(
      (coupon) => coupon.status === EnumUseStatus.UNUSED
    );
    // 判断优惠券是否过期
    dealCouponsOrGifts(unUsedCoupons);
    // 判断假期优享券是否可用
    dealHolidayCoupons(unUsedCoupons, tickets);
    if (unUsedCoupons.length === 0) return;
    // 挑出要使用的优惠券（优惠力度最高的）
    const coupon = pickOutCoupon(unUsedCoupons);
    if (!coupon) return;
    // 挑出要打折的票，判断能否使用优惠券
    const ticket = pickOutTicket(tickets);
    if (!ticket) return;
    setCurrentCoupon(coupon);
  };

  /**
   * 计算总价
   */
  const totalPrice = () => {
    return tickets.reduce((total, item) => {
      return total + item.price * item.num;
    }, 0);
  };

  /**
   * 支付成功后的回调
   */
  const onPaySuccess = () => {
    // 成功提示
    Taro.showToast({
      title: '支付成功',
      icon: 'none',
    });
    // 跳转到主页
    setTimeout(() => {
      Taro.navigateBack({ delta: 3 });
    }, 500);
  };

  /**
   * 支付取消/失败后的回调
   */
  const onFailed = () => {
    Taro.showToast({
      title: '支付失败',
      icon: 'none',
    });
    // 跳转到主页
    setTimeout(() => {
      Taro.navigateBack({ delta: 3 });
    }, 500);
  };

  /**
   * 发起支付
   */
  const initPayment = async () => {
    if (!isRead) {
      Taro.showToast({
        title: '请先阅读并同意游客须知',
        icon: 'none',
      });
      return;
    }
    if (!user?.id) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    const orderTotal = await requestForAddOrder(
      tickets,
      user?.id,
      currentCoupon
    );
    await payment(orderTotal.prepayId, onPaySuccess, onFailed);
  };

  return (
    <View className="order-review">
      <Cell.Group>
        <Cell
          title={
            <View className="tickets-title">
              <View>GO FARM 门票</View>
              <View className="price-number">
                {priceToStringDeformation(totalPrice())}
              </View>
            </View>
          }
        />
        <Cell>
          <View className="tickets-box">
            <View className="buy-date">{formatDate(tickets[0]?.date)}</View>
            {tickets
              .filter((item) => item.num > 0)
              .map((ticket) => {
                return (
                  <View className="tickets-item" key={ticket.id}>
                    <View>{ticket.name.split(' ')[0]}</View>
                    <View className="price">
                      <View>¥ {ticket.price}</View>
                      <View style={{ width: 30 }}>x {ticket.num}</View>
                    </View>
                  </View>
                );
              })}
          </View>
        </Cell>
        <Cell>
          <View className="coupon-box">
            <View className="coupon-none">
              <View className="coupon-title">优惠券</View>
              <View
                className="description"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/coupon-use/index?detail=${
                      router.params.detail
                    }&couponId=${currentCoupon?.id || ''}`,
                  })
                }>
                选择优惠券 <ArrowRight className="icon" size={14} />
              </View>
            </View>
            {currentCoupon && (
              <View className="tickets-item">
                <View>{currentCoupon?.name}</View>
                <View className="price">
                  <View>
                    {priceToStringDeformation(
                      -couponPrice(tickets, currentCoupon)
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        </Cell>
      </Cell.Group>
      <Checkbox
        checked={isRead}
        onChange={(val) => setIsRead(val)}
        label={
          <>
            <Text>已阅读并同意</Text>
            <Text className="clause-link" onClick={goPrivacyPolicy}>
              《GO FARM趣农场游客须知》
            </Text>
          </>
        }
      />

      <View className="empty"></View>

      <View className="bottom-box">
        <View className="total-price">
          <View>
            实付：
            <Text className="total-price-number">
              {priceToStringDeformation(
                totalPrice() - couponPrice(tickets, currentCoupon)
              )}
            </Text>
          </View>
          <ButtonOnce type="primary" onClick={initPayment}>
            立即支付
          </ButtonOnce>
        </View>
        <View className="empty"></View>
      </View>
    </View>
  );
}
