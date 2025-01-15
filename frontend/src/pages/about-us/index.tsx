import { Image, View } from '@tarojs/components';
import { domain } from '@/utils/request';
import './index.less';

export default function Index() {
  return (
    <View className="about-us">
      <View className="header">
        <Image src={`${domain}/images/about-us-title.png`} />
      </View>
      <View className="company-name">GO FARM趣农场</View>
      <View className="content">
        2024年，磨难如影随形，重生亦悄然而至。在这一年，我们历经了从拥有到失去，再从失去到拥有的曲折历程。那无数个充满疲劳、欣喜、失落、无奈与期待的日日夜夜，每一个瞬间都刻骨铭心。一草一木，皆凝聚着我们的心血；一点一滴，都满含着我们的期盼。而这一切，都是为了迎接更好的我们——GoFarm2.0
      </View>
      <View className="content">
        在这里，远离了城市的喧嚣鼎沸，摒弃了世界的纷纷扰扰。只剩下我们与动物们实现着最近距离的相拥。那是喜爱与被喜爱的交织，仿佛灵动的乐章在彼此心间奏响；是温暖与被温暖的传递，宛如冬日的暖阳洒落在灵魂的角落。而这些，便是我们对“体感式农场”的定义所在。
      </View>
      <View className="content">
        在我们的农场里，每一只动物都有属于自己独一无二的名字，每一只都是由专业的饲养员从小精心养大。正因为如此，这些可爱的动物们对人类有着十足的信任。你可以近距离地和它们互动，感受那份纯粹的温暖与亲近。它们每天都过得非常开心、自由。白天，它们可以在农场里自由自在地走动，傍晚就迫不及待地回到自己的卧室，享受美味的晚餐，然后美美入睡。
      </View>
      <View className="content">
        在这里的每一天都是一种享受。你可以忘却生活的烦恼，沉浸在这片充满爱与自由的天地。
      </View>
    </View>
  );
}
