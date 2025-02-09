import { View, Image, Text } from '@tarojs/components';
import { Button, Drag, Loading, Overlay } from '@nutui/nutui-react-taro';
import { EnumUseStatus, ICoupon } from '@/types/coupon';
import { useEffect, useState } from 'react';
import { IGift } from '@/types/gift';
import { useReady, useRouter } from '@tarojs/taro';
import { formatDate } from '@/utils/time';
import { getTimeStatus, REWARD_MAP } from '@/utils/price';
import { domain } from '@/utils/request';
import request from '@/utils/request';
import Taro from '@tarojs/taro';
import Birthday from './rewards-detail/birthday';
import Holiday from './rewards-detail/holiday';
import Keepsake from './rewards-detail/keepsake';
import Badge from './rewards-detail/badge';
import BlindBox from './rewards-detail/blind-box';
import Polaroid from './rewards-detail/polaroid';
import Drink from './rewards-detail/drink';
import Anniversary from './rewards-detail/anniversary';
import './index.less';

const DRAG_BUTTON_WIDTH = 40;

export default function Index() {
  const [couponOrGift, setCouponOrGift] = useState<ICoupon | IGift>();
  const [dragLimit, setDragLimit] = useState({ min: 0, max: 0, width: 0 });
  const [dragValue, setDragValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCouponOrGift();
  }, []);

  useReady(() => {
    // 用于滑块滑动的宽度计算
    Taro.createSelectorQuery()
      .select(`#dragContainer`)
      .boundingClientRect()
      .exec((res) => {
        const rect = res[0] || {};
        if (!rect) return;
        setDragLimit({
          min: rect.left,
          max: rect.left,
          width: rect.width,
        });
      });
  });

  const getCouponOrGift = async () => {
    const id = router.params.id as string;
    const type = router.params.type as string;
    if (type === 'coupon') {
      await requestForCoupon(id);
    } else {
      await requestForGift(id);
    }
  };

  /**
   * 获取礼物详情
   */
  const requestForGift = async (id: string) => {
    const gift = await request.get<IGift>('/gift/detail', { id });
    gift._startTime = formatDate(gift.canUseTime.split(' to ')[0]);
    gift._endTime = formatDate(gift.canUseTime.split(' to ')[1]);
    gift._timeStatus = getTimeStatus(gift);
    setCouponOrGift(gift);
  };

  /**
   * 获取优惠券详情
   */
  const requestForCoupon = async (id: string) => {
    const coupon = await request.get<ICoupon>('/coupon/detail', { id });
    coupon._startTime = formatDate(coupon.canUseTime.split(' to ')[0]);
    coupon._endTime = formatDate(coupon.canUseTime.split(' to ')[1]);
    coupon._timeStatus = getTimeStatus(coupon);
    setCouponOrGift(coupon);
  };

  /**
   * 使用礼物券
   */
  const requestToUseGift = async (id: string) => {
    setIsLoading(true);
    try {
      await request.post('/gift/use', { id });
      await getCouponOrGift();
    } finally {
      setIsLoading(false);
    }
  };

  const onDrag = (e: any) => {
    const originalWidth = 30;
    let backgroundWidth = Math.min(
      e.offset[0] + originalWidth,
      dragLimit.width - DRAG_BUTTON_WIDTH + originalWidth
    );
    backgroundWidth = Math.max(backgroundWidth, originalWidth);
    setDragValue(backgroundWidth);
  };

  const onDragEnd = (e: any) => {
    // 判断是否滑动到终点，给予5px的偏差
    if (e.offset[0] >= dragLimit.width - DRAG_BUTTON_WIDTH - 5) {
      const id = router.params.id as string;
      requestToUseGift(id);
    }
  };

  const goTicketNoticePage = () => {
    Taro.navigateTo({ url: '/pages/ticket-notice/index' });
  };

  return (
    <View className="reward-detail">
      <View className="head-card">
        <View className="card-left">
          {couponOrGift?.['strategy'] ? '抵扣券' : '礼品券'}
        </View>
        <View
          className="card-right"
          style={
            couponOrGift?.['strategy'] ? {} : { padding: '46rpx 0 66rpx 0' }
          }>
          <View className="reward-name">{couponOrGift?.name}</View>
          <View className="reward-expiry">
            有效期至：{couponOrGift?._endTime}
          </View>
        </View>
      </View>
      {!couponOrGift?.['strategy'] && (
        <>
          <View className="bar-code-header" />
          <View className="bar-code-header-shadow" />
          <View
            className="bar-code-wrap"
            style={
              couponOrGift?.status === EnumUseStatus.USED
                ? { height: '98rpx' }
                : {}
            }>
            <Image src={`${domain}/images/bar-code.png`} />
            <View className="bar-code-text-1">兑换商家</View>
            <View className="bar-code-text-2">GO FARM趣农场</View>
            {couponOrGift?.status === EnumUseStatus.UNUSED && (
              <>
                <View className="bar-code-text-3">
                  仅限商户操作：
                  <Text className="bar-code-text-4">
                    将滑块拖向右侧尽头，完成兑换
                  </Text>
                </View>
                <View id="dragContainer" className="drag-container">
                  <View
                    className="drag-background"
                    style={{ width: dragValue }}></View>
                  <Drag
                    key={dragLimit.min}
                    direction="x"
                    boundary={{
                      left: dragLimit.min,
                      right: dragLimit.max,
                      top: 0,
                      bottom: 0,
                    }}
                    onDrag={onDrag}
                    onDragEnd={onDragEnd}>
                    <Button key={dragLimit.min} type="primary" />
                  </Drag>
                </View>
              </>
            )}
          </View>
        </>
      )}

      {REWARD_MAP.BIRTHDAY(couponOrGift?.name || '') && <Birthday />}
      {REWARD_MAP.HOLIDAY(couponOrGift?.name || '') && <Holiday />}
      {REWARD_MAP.KEEPSAKE(couponOrGift?.name || '') && <Keepsake />}
      {REWARD_MAP.BADGE(couponOrGift?.name || '') && <Badge />}
      {REWARD_MAP.BLINDBOX(couponOrGift?.name || '') && <BlindBox />}
      {REWARD_MAP.POLAROID(couponOrGift?.name || '') && <Polaroid />}
      {REWARD_MAP.DRINK(couponOrGift?.name || '') && <Drink />}
      {REWARD_MAP.ANNIVERSARY(couponOrGift?.name || '') && <Anniversary />}

      {!!couponOrGift?.['strategy'] && (
        <>
          <View className="empty"></View>
          <View className="buy-section">
            <Button type="primary" block onClick={() => goTicketNoticePage()}>
              立即使用
            </Button>
          </View>
        </>
      )}
      <Overlay visible={isLoading}>
        <div className="overlay">
          <Loading direction="vertical">加载中</Loading>
        </div>
      </Overlay>
    </View>
  );
}
