import { useSelector, useDispatch } from 'react-redux';
import { View } from '@tarojs/components';
import { setTabbarIndex } from '@/store/system-slice';
import {
  ShareAppMessageObject,
  useShareAppMessage,
  useShareTimeline,
} from '@tarojs/taro';
import { domain } from '@/utils/request';
import TabbarBottom from '@/components/tabbar-bottom';
import Home from './home';
import Map from './map';
import Order from './order';
import Mine from './mine';

import './index.less';

const pageMap = [<Home />, <Map />, <Order />, <Mine />];

export default function Index() {
  const tabbarIndex = useSelector((state: any) => state.system.tabbarIndex);

  const dispatch = useDispatch();

  const onTabbarChange = (index: number) => {
    dispatch(setTabbarIndex(index));
  };

  useShareAppMessage(() => ({
    title: '分享农场，让生活更美好',
    path: '/pages/index/index',
    imageUrl: `${domain}/images/share.jpg`,
  }));

  useShareTimeline(() => ({
    title: '分享农场，让生活更美好',
    path: '/pages/index/index',
    imageUrl: `${domain}/images/share.jpg`,
  }));

  return (
    <View className="index">
      <View className="content">{pageMap[tabbarIndex]}</View>
      <TabbarBottom value={tabbarIndex} onChange={onTabbarChange} />
    </View>
  );
}
