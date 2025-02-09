import { useEffect, useState } from 'react';
import { Image, View } from '@tarojs/components';
import { Phone, Location } from '@nutui/icons-react-taro';
import { domain } from '@/utils/request';
import { fetchUser, getUser } from '@/utils/user';
import Taro, { useDidShow } from '@tarojs/taro';
import CardUserAvatar from './components/card-user-avatar';
import CardBusiness from './components/card-business';
import CardSwiper from './components/card-swiper';
import CardActivity from './components/card-activity';
import './index.less';

export default function Index() {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (user) fetchUser(user.id).then((res) => setUser(res));
  }, []);

  useDidShow(() => {
    const _user = getUser();
    if (_user) fetchUser(_user.id).then((res) => setUser(res));
  });

  const handleOpenLocation = () => {
    Taro.openLocation({
      latitude: 30.73234,
      longitude: 120.043363,
      name: 'GO FARM趣农场',
      address: '湖州市吴兴区东林镇钓妙线望乡岭西911米',
      scale: 18,
    });
  };

  const handleMakePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '13706525383',
    });
  };

  return (
    <View className="home">
      <CardSwiper />
      <CardUserAvatar user={user} />
      <CardBusiness user={user} />
      <CardActivity />
      <View className="footer">
        <Image
          className="login-title"
          src={`${domain}/images/login-title.png`}
        />
        <View className="address" onClick={handleOpenLocation}>
          <Location size={13} />
          &nbsp;湖州市吴兴区东林镇钓妙线望乡岭西911米
        </View>
        <View className="address-tip" onClick={handleOpenLocation}>
          （点击地址即可导航）
        </View>
        <View className="phone" onClick={handleMakePhoneCall}>
          <Phone size={13} /> &nbsp;13706525383
        </View>
      </View>
      <View className="empty"></View>
    </View>
  );
}
