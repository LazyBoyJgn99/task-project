import { View, Text } from '@tarojs/components';

export default function Index() {
  return (
    <View className="clause-detail">
      <View className="title-1">免责承诺书</View>
      <View className="content">
        特别提醒：出于安全考虑，不建议
        <Text style={{ fontWeight: 600 }}>
          孕妇、65岁以上老人、80cm以下儿童、高血压、心脏病患者或害怕动物的游客
        </Text>
        入园。如坚持入园，需签订入园协议，并自行承担所有安全责任，园区概不负责。
      </View>

      <View className="title-2"></View>
      <View className="content">姓名：</View>
      <View className="content">电话：</View>
      <View className="content">身份证号码：</View>

      <View className="title-2"></View>
      <View className="content">
        本人已完全理解GoFarm工作人员告知的相关注意事项，并承诺如下：
      </View>
      <View className="content">
        1、本人已知晓不适宜参加游园活动，因本人坚持参加，自愿承担因此造成的所有后果。
      </View>
      <View className="content">
        2、本人确认已充分了解自身身体状况，自愿参与游园活动并承诺遵守所有游园要求。
      </View>
      <View className="content">
        3、本人如未如实告知自身健康情况，自愿承担因此造成的所有后果。
      </View>
      <View className="content">
        本人已阅读并完全理解以上条款，若发生纠纷，以本书承诺为准。
      </View>

      <View className="title-footer"></View>
      <View className="content">承诺人：</View>
      <View className="content">日期：</View>
    </View>
  );
}
