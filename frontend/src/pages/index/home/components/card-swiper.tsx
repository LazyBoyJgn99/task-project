import { Swiper } from '@nutui/nutui-react-taro';
import { Image, View } from '@tarojs/components';
import { domain } from '@/utils/request';
import './card-swiper.less';

const imageList = [
  `${domain}/images/home-swiper-3.png`,
  `${domain}/images/home-swiper-1.png`,
  `${domain}/images/home-swiper-2.png`,
];

export default function Index() {
  return (
    <View className="home-card-swiper">
      <Swiper defaultValue={0} autoPlay loop>
        {imageList.map((item, index) => (
          <Swiper.Item key={index}>
            <Image src={item}></Image>
          </Swiper.Item>
        ))}
      </Swiper>
      <View className="home-card-swiper-mask"></View>
    </View>
  );
}
