import { Button } from '@nutui/nutui-react-taro';
import { View, Text, Image } from '@tarojs/components';
import { domain } from '@/utils/request';

export default function Index() {
  return (
    <View className="clause-detail">
      <View className="title-1">农场生活深度体验</View>
      <View className="content">
        <Text className="font-blod">活动时间：</Text>11月30日-12月8日
        &nbsp;&nbsp;13:10-16:30
      </View>
      <View className="content">
        <Text className="font-blod">门票类别：</Text>1888/双人；2888/5人组
      </View>
      <View className="content">
        <Text className="font-blod">体验包含：</Text>
      </View>
      <View className="content">1. 当日包场</View>
      <View className="content">
        2. 跟拍记录你和小动物的美好时刻（所有底片）
      </View>
      <View className="content">3. 纪念品（小木雕一份）</View>
      <View className="content">4. 咖啡（人数份）</View>
      <View className="content">5. 草料/饲料（人数份）</View>
      <View className="image-box">
        <Image src={`${domain}/images/activity-all-day-1.png`} />
      </View>
      <View className="title-2">具体体验日程</View>
      <View className="content font-blod">13:10 - 13:20 迎接与介绍</View>
      <View className="content">地点：农场检票口</View>
      <View className="content">
        内容：参与者到达后，农场主迎接，进行简短介绍。介绍农场的历史、动物种类及其生活环境。
      </View>

      <View className="content font-blod" style={{ marginTop: 20 }}>
        13：30-15：00 动物护理与互动
      </View>
      <View className="content">
        地点：猫区 / 柯基区 / 萌宠区 / 新生动物区 / 爬宠 / 禽类区 /
        谷仓区（n选3）
      </View>
      <View className="content">
        内容包括但不限于：
        学习如何给动物洗澡、梳毛和检查健康状况。与动物互动，拍照留念，增强与动物的情感联系。
      </View>

      <View className="content font-blod" style={{ marginTop: 20 }}>
        15：00-15：30 自由活动 / 农场基础工作体验
      </View>
      <View className="content">地点：农场各个地方</View>
      <View className="content">内容包括但不限于：扒草坪、修树、木工活等</View>

      <View className="content font-blod" style={{ marginTop: 20 }}>
        15：30-16：30 动物喂养体验
      </View>
      <View className="content">
        地点：嘟嘟 / 枪钉 / 阿发 / 兔子 / 猫 / 大型动物回棚 / 柯基回笼 /
        羊上（n选3）
      </View>
      <View className="content">
        学习如何正确喂养不同的动物；了解每种动物的饮食习惯和营养需求，体验喂食；
      </View>

      <View className="content font-blod" style={{ marginTop: 20 }}>
        整个过程中都会有摄影师进行记录，并将所有底片给到你哦~
      </View>

      <View className="image-box">
        <Image src={`${domain}/images/activity-all-day-2.png`} />
      </View>

      <View className="title-2">注意事项</View>
      <View className="content font-blod">
        · 服装：建议穿着舒适的衣物和防滑鞋，适合户外活动。
      </View>
      <View className="content font-blod">
        · 饮水：请自带水壶，农场会提供饮水补给。
      </View>
      <View className="content font-blod">
        · 安全：注意安全，遵循农场工作人员的指示，尤其是在接触动物时。
      </View>
      <View className="content font-blod">
        · 其他：若预约当天因天气原因导致活动不能进行，则重新预约时间；
      </View>

      <View className="content" style={{ marginTop: 16, textIndent: '2em' }}>
        通过这样的体验，参与者不仅能享受与动物亲密接触的乐趣，还能学习到动物护理、饲养和农场管理的知识，增强对动物福利和生态保护的认识。
      </View>

      <View className="foot-box">
        <Button type="primary" open-type="contact" block>
          联系我们
        </Button>
      </View>
      <View className="empty"></View>
    </View>
  );
}
