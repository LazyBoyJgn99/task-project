import { View, Text } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import { IGift } from '@/types/gift';
import { descriptionMap, discountFormat } from '@/utils/price';
import { EnumTimeStatus, EnumUseStatus, ICoupon } from '@/types/coupon';
import Taro from '@tarojs/taro';
import './card-reward.less';

export default function Index(props: IProps) {
  const { reward } = props;
  const isCoupon = !!reward['strategy'];

  return (
    <View
      className={
        reward.status === EnumUseStatus.USED ||
        reward._timeStatus === EnumTimeStatus.OVER_TIME
          ? 'reward-list-card-reward card-reward-isused'
          : 'reward-list-card-reward'
      }>
      <View className="reward-left">
        <Text className="reward-type">{isCoupon ? '抵扣券' : '礼品券'}</Text>
      </View>
      <View className="reward-main">
        <View className="reward-title">{reward.name}</View>
        <View className="reward-description">
          {descriptionMap(reward.name)}
        </View>
        {isCoupon && (
          <View className="reward-discount">
            {discountFormat(reward['strategy'])}
          </View>
        )}
      </View>
      <View className="reward-right">
        <View className="ball-left-top"></View>
        <View className="ball-left-bottom"></View>
        {getStatusRender(reward)}
        {isCoupon && (
          <>
            <View className="reward-expiry">有效期：</View>
            <View className="reward-expiry">{reward._startTime} 至</View>
            <View className="reward-expiry">{reward._endTime}</View>
          </>
        )}
        {!isCoupon && (
          <>
            <View className="reward-expiry">有效期至：</View>
            <View className="reward-expiry">{reward._endTime}</View>
          </>
        )}
      </View>
    </View>
  );
}

interface IProps {
  reward: ICoupon | IGift;
}

const goRewardDetail = (id: string, type: string) => {
  Taro.navigateTo({
    url: `/pages/reward-detail/index?id=${id}&type=${type}`,
  });
};

const getStatusRender = (reward: ICoupon | IGift) => {
  if (reward.status === EnumUseStatus.USED)
    return <View className="reward-used">已使用</View>;
  if (reward._timeStatus === EnumTimeStatus.OVER_TIME)
    return <View className="reward-used">已过期</View>;
  if (reward._timeStatus === EnumTimeStatus.NOT_START)
    return <View className="reward-not-start">未到使用时间</View>;
  return (
    <Button
      className="reward-button"
      size="mini"
      onClick={() =>
        goRewardDetail(reward.id, !!reward['strategy'] ? 'coupon' : 'gift')
      }>
      立即使用
    </Button>
  );
};
