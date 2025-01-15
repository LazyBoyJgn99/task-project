import { Image, View } from '@tarojs/components';
import { domain } from '@/utils/request';
import './index.less';

export default function Index() {
  return (
    <View className="clause-detail">
      <View className="title-1">🌟 疯狂星期三，尽享动物农场的乐趣！🌟</View>
      <View className="content text-indent-fitst">
        每周三，您可以以仅需 98元/人 的超值价格，畅游GO
        FARM！新开业新福利，让您和家人朋友一起亲密接触可爱的小动物，感受大自然的魅力。
      </View>
      <View className="image-box">
        <Image src={`${domain}/images/activity-wednesday-1.png`} />
      </View>
      <View className="content">🐾 为什么选择星期三？</View>
      <View className="content">
        · 超值门票：星期三成人门票特惠价仅需98元！
      </View>
      <View className="content">
        ·
        悠闲的游玩体验：星期三的访客相对较少，您可以更自在地与动物们亲密接触，享受一个宁静而愉快的悠闲时光。
      </View>
      <View className="content">
        ·
        丰富的互动活动：参与喂食、拍照、和小动物们一起玩耍，给自己和家人留下难忘的回忆！
      </View>
      <View className="content text-indent-fitst">
        无论是带着孩子的家庭，还是喜欢动物的朋友，星期三都是您体验农场生活的超棒时机！快来加入我们，和可爱的小动物们一起度过一个快乐的日子吧！🐶🐷🐰
      </View>
      <View className="content text-indent-fitst">
        📅 记得提前预约，名额有限哦！期待您的光临！
      </View>
      <View className="empty"></View>
    </View>
  );
}
