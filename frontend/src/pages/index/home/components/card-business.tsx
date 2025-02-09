import { IUser } from '@/types/user';
import { Cell } from '@nutui/nutui-react-taro';
import { Image, View } from '@tarojs/components';
import { todoModule } from '@/utils/tips';
import { domain } from '@/utils/request';
import Taro from '@tarojs/taro';
import './card-business.less';

interface IProps {
  user: IUser;
}

export default function Index(props: IProps) {
  return (
    <Cell className="home-card-business">
      <View
        className="part"
        onClick={() => Taro.navigateTo({ url: '/pages/ticket-notice/index' })}>
        <View className="title">门票购买</View>
        <View className="describtion">预定门票 轻松游玩</View>
        <Image src={`${domain}/images/home-ticket.png`} />
      </View>
      <View className="part" onClick={() => todoModule('已约满')}>
        <View className="title">摄影预定</View>
        <View className="describtion">一键预约 定格美好</View>
        <Image src={`${domain}/images/home-photo.png`} />
      </View>
    </Cell>
  );
}
