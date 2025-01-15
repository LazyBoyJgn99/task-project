import { Tabbar } from '@nutui/nutui-react-taro';
import { IconFont } from '@nutui/icons-react-taro';
import { Image, View } from '@tarojs/components';
import { domain } from '@/utils/request';
import Taro from '@tarojs/taro';
import './index.less';

const pageMap = [
  {
    title: '首页',
    icon: (
      <IconFont
        size={22}
        fontClassName="icon"
        classPrefix="go-farm"
        name="home"
      />
    ),
  },
  {
    title: '地图',
    icon: (
      <IconFont
        size={22}
        fontClassName="icon"
        classPrefix="go-farm"
        name="map"
      />
    ),
  },
  {
    title: '订单',
    icon: (
      <IconFont
        size={22}
        fontClassName="icon"
        classPrefix="go-farm"
        name="order"
      />
    ),
  },
  {
    title: '我的',
    icon: (
      <IconFont
        size={22}
        fontClassName="icon"
        classPrefix="go-farm"
        name="mine"
      />
    ),
  },
];

interface IProps {
  value: number;
  onChange: (index: number) => void;
}

export default function Index(props: IProps) {
  const onTicketClick = () => {
    Taro.navigateTo({ url: '/pages/ticket-use/index' });
  };

  return (
    <View className="tabbar-bottom">
      <Tabbar value={props.value} onSwitch={props.onChange} fixed>
        {pageMap.map((item, index) => (
          <Tabbar.Item key={index} title={item.title} icon={item.icon} />
        ))}
      </Tabbar>
      <View className="ticket-box-shadow"></View>
      <View className="ticket-box" onClick={onTicketClick}>
        <Image src={`${domain}/images/qr-code.png`} />
      </View>
    </View>
  );
}
