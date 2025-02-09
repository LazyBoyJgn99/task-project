import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import './index.less';

export default function Index() {
  return (
    <View className="ticket-notice">
      <View className="title">
        <Text>Go Farm 入园门票（不支持退款）</Text>
      </View>

      <View className="section">
        <Text className="section-title">门票说明</Text>
        <View className="description">
          <View className="content">
            农场全天票，每日限量，营业时间依季节调整
          </View>
          <View className="content key-text">
            营业时间
            10:00-16:00（秋冬）；11:30-12:10为动物休息时间，所有动物互动关闭，游客需离开所有互动区
          </View>
          <View
            style={{ fontWeight: 600, color: '#ec5b56' }}
            className="content">
            门票不支持退款
          </View>
        </View>
      </View>

      <View className="section">
        <Text className="section-title">门票类型</Text>
        <View className="description">
          <View className="content">儿童票：身高80cm-130cm</View>
          <View className="content">以入园当日身高测量为准</View>
          <View className="content">成人票：身高130cm以上需购买成人票</View>
        </View>
      </View>

      <View className="section">
        <Text className="section-title">补充说明</Text>
        <View className="description">
          <View className="content">未成年人需由成年人陪同才可入园游玩。</View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>
              孕妇、65岁以上老人、80cm以下儿童、高血压、心脏病患者或害怕动物的游客
            </Text>
            ，不建议入园。如坚持入园，需签订免责协议并自行承担安全责任，园区概不负责。
          </View>
        </View>
      </View>

      <View className="section">
        <Text className="section-title">入园须知</Text>
        <View className="description">
          <View className="content">
            1. 禁止携带任何桌椅/禁止自带食物/禁止吸烟。
          </View>
          <View className="content">
            2. 禁止追赶动物、大声尖叫等行为，以免造成不必要的伤害。
          </View>
          <View className="content">3. 谢绝外带宠物入园。</View>
          <View className="content">
            4. 请勿擅自移动园区内造景，请勿私自将动物带离专属互动区。
          </View>
          <View className="content">
            5. 园区动物有规定食物，谢绝自带胡萝卜、蔬菜等食物投喂。
          </View>
          <View className="content">
            6. 天气及其他不可抗因素不营业时，客服会提前通知已购票客户。
          </View>
          <View className="content">7. 请勿擅自开门、攀爬或进入互动区。</View>
          <View className="content">
            8.
            为了您和他人的安全请遵守每个互动区的规定，请务必在动物指引员陪同下和动物近距离互动，以免受伤。
          </View>
          <View className="content">
            【如有发现，工作人员有权要求离园 费用不退】
          </View>
        </View>
      </View>

      <View className="section">
        <Text className="section-title">门票互动内容</Text>
        <View className="description">
          <View className="content">
            <Text style={{ fontWeight: 600 }}>户外混养区</Text>
            ：近距离接触、羊、羊驼、矮脚马、喂草合影。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>狗狗乐园</Text>
            ：近距离接触柯基、查理王、可卡、巨贵、秋田等犬只合影。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>萌宠区</Text>
            ：近距离接触侏儒兔、土拨鼠、臭鼬、狐獴等小宠喂草合影。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>禽类区</Text>
            ：近距离接触菊头鸡、希尔鸡、帽子鸡、天仙宝宝、寒鸦等动物合影。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>手养区</Text>
            ：近距离接触小羊、小猪、小牛等动物喂奶合影。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>猫咪乐园</Text>
            ：近距离和猫咪们合影。可以摸摸，不要抱猫容易被抓伤。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>森林区</Text>
            ：近距离接触梅花鹿、柯尔鸭、孔雀等动物喂食合影。
          </View>
          <View className="content">
            <Text style={{ fontWeight: 600 }}>爬宠区</Text>
            ：近距离接触各类爬虫 刺猬等合影。
          </View>
          <View style={{ marginTop: 12 }} className="content">
            所有互动活动根据当天天气状况及动物状态而定，具体以现场工作人员安排为准。若游客希望指定互动某种动物，请在购票前电话联系客服确认。
          </View>
          <View style={{ marginTop: 12 }} className="content">
            入园后联系各区域工作人员，并在工作人员协助下进行互动，游客可自由选择游玩顺序，但不得擅自将动物带离指定互动区域，不得私自移动园区内任何拍摄道具及造景布置。
          </View>
        </View>
      </View>

      <View className="section">
        <Text className="section-title">GO FARM友情提示</Text>
        <View className="description">
          <View className="content">
            1.
            在与动物近距离互动时，可能会接触到一些动物的体味，或出现偶然的抓伤、划伤、咬伤情况。园区大部分动物为散养状态，购票前请慎重考虑。
          </View>
          <View style={{ marginTop: 12 }} className="content">
            2.
            如游客在园区内被动物抓伤或咬伤等，请第一时间联系现场工作人员，离园概不负责。
          </View>
        </View>
      </View>

      <View className="section">
        <Text className="section-title"></Text>
        <View className="description">
          <View className="content">
            为确保动物和大家的安全，请认真阅读注意事项。
          </View>
        </View>
      </View>

      <View className="empty"></View>

      <View className="buy-section">
        <Button
          type="primary"
          block
          onClick={() => Taro.navigateTo({ url: '/pages/ticket-buy/index' })}>
          前往购买
        </Button>
      </View>
    </View>
  );
}
