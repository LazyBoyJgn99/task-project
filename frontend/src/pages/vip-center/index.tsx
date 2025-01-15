import { useSelector } from 'react-redux';
import { ArrowLeft } from '@nutui/icons-react-taro';
import { NavBar, Swiper } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import { getUser } from '@/utils/user';
import Taro from '@tarojs/taro';
import IconReward from './components/icon-reward';
import CardVip from './components/card-vip';
import './index.less';
import { useState } from 'react';

export default function Index() {
  const user = getUser();
  const barHeight = useSelector((state: any) => state.system.barHeight);
  const [swiperIndex, setSwiperIndex] = useState(user.level - 1);
  const vipCardList = [
    {
      level: 1,
      currentLevel: user.level === 1,
      points: 500,
    },
    {
      level: 2,
      currentLevel: user.level === 2,
      points: 1000,
    },
    {
      level: 3,
      currentLevel: user.level === 3,
      points: 3000,
    },
    {
      level: 4,
      currentLevel: user.level === 4,
      points: 3000,
    },
  ];

  const iconCount = () =>
    vipIcons.filter((item) => swiperIndex + 1 >= item.needLevel).length;

  const chooseLevel = () => swiperIndex + 1;

  return (
    <View className="vip-center">
      <NavBar
        style={{ position: 'fixed', top: `${barHeight}px` }}
        back={<ArrowLeft size={18} />}
        onBackClick={() => Taro.navigateBack()}
      />
      <Swiper
        className="vip-swiper"
        defaultValue={swiperIndex}
        previousMargin="24px"
        nextMargin="24px"
        onChange={(e) => setSwiperIndex(e.detail.current)}>
        {vipCardList.map((item) => (
          <Swiper.Item key={item.level}>
            <View className="swiper-item">
              <CardVip
                user={user}
                level={item.level}
                isCurrentLevel={item.currentLevel}
                points={item.points}
              />
            </View>
          </Swiper.Item>
        ))}
      </Swiper>
      <View className="background-top" />
      <View className="title">
        <View className="line-left" />
        <View className="text">可享{iconCount()}项会员权益</View>
        <View className="line-right" />
      </View>
      <View className="content">
        {vipIcons.map((item, index) => (
          <IconReward
            key={index}
            icon={item.icon}
            title={item.title}
            lock={chooseLevel() < item.needLevel}
          />
        ))}
      </View>
    </View>
  );
}

const vipIcons = [
  { icon: 'birthday', title: '生日礼券', needLevel: 2 },
  { icon: 'gift', title: '限定纪念品', needLevel: 2 },
  { icon: 'badge', title: '专属徽章', needLevel: 2 },
  { icon: 'holiday', title: '假日优享券', needLevel: 3 },
  { icon: 'blind-box', title: '惊喜盲盒', needLevel: 3 },
  { icon: 'drink', title: '乐享双杯', needLevel: 4 },
  { icon: 'balloon', title: '双人年庆票', needLevel: 4 },
  { icon: 'photo', title: '拍立得留念', needLevel: 4 },
  { icon: 'vip', title: '惊喜奇遇', needLevel: 4 },
];
