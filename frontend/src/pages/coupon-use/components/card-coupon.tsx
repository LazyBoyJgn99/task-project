import { View, Text } from '@tarojs/components';
import { Checkbox } from '@nutui/nutui-react-taro';
import { EnumTimeStatus, ICoupon } from '@/types/coupon';
import { descriptionMap, discountFormat } from '@/utils/price';
import './card-coupon.less';

export default function Index(props: IProps) {
  const { coupon, value } = props;
  return (
    <View className="coupon-use-card-coupon">
      <View className="coupon-left">
        <Text className="coupon-type">抵扣券</Text>
      </View>
      <View className="coupon-main">
        <View className="coupon-title">{coupon.name}</View>
        <View className="coupon-description">
          {descriptionMap(coupon.name)}
        </View>
        <View className="coupon-expiry">
          有效期：{coupon._startTime} 至 {coupon._endTime}
        </View>
        <View className="coupon-discount">
          {discountFormat(coupon.strategy)}
        </View>
      </View>
      <View className="coupon-right">
        <Checkbox
          disabled={coupon._timeStatus !== EnumTimeStatus.IN_TIME}
          value={value}
          className="checkbox"
        />
      </View>
    </View>
  );
}

interface IProps {
  coupon: ICoupon;
  value: string;
}
