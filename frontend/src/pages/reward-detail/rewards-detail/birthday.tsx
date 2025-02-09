import { View } from '@tarojs/components';

export default function Index() {
  return (
    <>
      <View className="reward-description">
        <View className="title">优惠券详情</View>
        <View className="content">
          1.
          每个GoFarm体感式农场注册用户每年可且仅可在GoFarm体感式农场官方小程序上获得至多1张生日特权券，发放时间为生日当月1号。GoFarm体感式农场注册用户是指在“GoFarm体感式农场”官方微信公众GoFarm体感式农场”官方微信小程序等官方渠道注册的用户。
        </View>
        <View className="content">
          2.
          用户可以在GoFarm体感式农场官方小程序的“我的优惠券”内查看成功领取的特权券。
        </View>
      </View>
      <View className="reward-description">
        <View className="title">使用说明</View>
        <View className="content">
          1.
          本特权券使用有效期：生日当月有效（例如：2024年12月任意日期生日，于2024年12月1日获得本券，使用有效期为2024年12月1日-2024年12月31日23:59），具体可见特权券券面上的截止日期。超时未使用则自动过期，券过期不补发。
        </View>
        <View className="content">
          2.
          本特权券仅适用于在GoFarm体感式农场官方小程序或GoFarm体感式农场官方微信公众号上购买门票享一次单张票面价格x折；每笔购买订单仅可使用一张本特权券。
        </View>
        <View className="content">
          3.
          本特权券不可兑换现金，不找零，不可改期，不可转让，不可转卖，不可叠加使用，不可与GoFarm体感式农场其他优惠同时使用，除非法律另有规定；超过本特权券金额部分由持券人自行支付。
        </View>
        <View className="content">
          4. 本特权券，遗失不补，同一张特权券不可重复使用。
        </View>
        <View className="content">
          5.
          如您在使用本特权券过程中遇到问题，请致电GoFarm体感式农场服务电话137-5707-7751。
        </View>
      </View>
    </>
  );
}
