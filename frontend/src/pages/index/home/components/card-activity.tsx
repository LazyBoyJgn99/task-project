import Taro from '@tarojs/taro';
import { Cell } from '@nutui/nutui-react-taro';
import { View, Image } from '@tarojs/components';
import { domain } from '@/utils/request';
import './card-activity.less';

const imageList = [
  `${domain}/images/home-active-4.png`,
  `${domain}/images/home-active-5.png`,
  `${domain}/images/home-active-2.png`,
  `${domain}/images/home-active-3.png`,
];

const urlList = [
  '/pages/activity-all-day-ticket/index',
  '/pages/activity-blind-box/index',
  '/pages/activity-curriculum/index',
  '/pages/activity-cooperation/index',
];

export default function Index() {
  return (
    <View className="home-card-activity">
      {imageList.map((item, index) => (
        <Cell
          key={index}
          onClick={() => Taro.navigateTo({ url: urlList[index] })}>
          <Image src={item}></Image>
        </Cell>
      ))}
    </View>
  );
}
