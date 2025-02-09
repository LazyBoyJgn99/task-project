import { Image, View } from '@tarojs/components';
import { domain } from '@/utils/request';

export default function Index() {
  return (
    <View className="clause-detail">
      <View className="title-1">探索动物的世界，培养关爱与责任感！</View>
      <View className="content text-indent-fitst">
        欢迎参加我们的动物互动体验课程，这是一项专为热爱动物的小朋友和成人设计的独特体验，您将有机会与可爱的兔子、狗、雪貂、小鸡等小动物亲密接触，学习如何呵护它们，增进对动物的理解与热爱。
      </View>
      <View className="image-box">
        <Image src={`${domain}/images/curriculum-1.png`} />
      </View>
      <View className="title-2">课程内容：</View>
      <View className="title-2">动物护理与美容知识</View>
      <View className="content text-indent-fitst">
        学习如何科学地护理不同种类的小动物，包括饮食、健康和日常护理知识。了解动物的基本生理特征和习性，提升您的动物照顾能力。
      </View>
      <View className="title-2">毛发梳理与美容</View>
      <View className="content text-indent-fitst">
        实践如何为兔子、狗等动物梳理毛发，保持它们的毛发光滑健康。学习毛发修剪技巧，让您的小伙伴看起来更加整洁可爱。
      </View>
      <View className="title-2">指甲修剪与耳朵清洁</View>
      <View className="content text-indent-fitst">
        掌握安全有效的指甲修剪方法，确保小动物的舒适与安全。学习清洁耳朵的正确步骤，维护动物的卫生与健康。
      </View>
      <View className="title-2">动物手工课程</View>
      <View className="content text-indent-fitst">
        除了护理知识，我们还提供动物手工课程，您将亲手制作与动物相关的创意手工艺品，增添乐趣与互动。通过手工课程，培养动手能力和创造力，让您与动物的互动更加丰富多彩。
      </View>
      <View className="image-box">
        <Image src={`${domain}/images/curriculum-2.png`} />
      </View>
      <View className="title-2">适合对象：</View>
      <View className="content text-indent-fitst">
        本课程欢迎所有热爱动物的人士，无论是小朋友还是成人，都可以报名参加。我们将根据参与者的年龄和经验，提供个性化的指导和支持。
      </View>
      <View className="title-2">课程时间与地点：</View>
      <View className="content">
        时间：每周末及节假日（具体时间可根据报名情况调整）
      </View>
      <View className="content">
        地点：湖州市吴兴区东林镇钓妙线望乡岭西911米
      </View>
      <View className="title-2">报名方式：</View>
      <View className="content text-indent-fitst">
        如您对我们的动物互动体验课程感兴趣，请通过以下方式报名：
      </View>
      <View className="content">电话：13706525383</View>
      <View className="content">邮箱：359331881@qq.com</View>
      <View className="content text-indent-fitst">
        让我们一起走进动物的世界，体验关爱与乐趣，培养责任感与爱心！期待您的参与！如需进一步调整或补充具体信息，请告诉我！
      </View>
      <View className="empty"></View>
    </View>
  );
}
