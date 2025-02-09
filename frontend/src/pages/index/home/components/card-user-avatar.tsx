import { View, Image, Text } from '@tarojs/components';
import { Avatar, Button, Cell } from '@nutui/nutui-react-taro';
import { IconFont } from '@nutui/icons-react-taro';
import { IUser } from '@/types/user';
import { domain } from '@/utils/request';
import Taro from '@tarojs/taro';
import './card-user-avatar.less';

interface IProps {
  user: IUser;
}

export default function Index(props: IProps) {
  const { user } = props;

  return (
    <Cell className="home-user-avatar">
      {user && (
        <>
          <View className="user-info-box">
            <Avatar
              className="nut-avatar"
              icon={
                <IconFont
                  fontClassName="icon"
                  color="#000"
                  classPrefix="go-farm"
                  name="avatar"
                />
              }
              shape="round"
              onClick={() =>
                Taro.navigateTo({ url: `/pages/user-update/index` })
              }
            />
            <View className="user-info">
              <View
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/user-update/index` })
                }>
                嗨，{user.name}
              </View>
              <View className="user-level">动物饲养员 v{user.level}</View>
            </View>
          </View>
          <View className="points-box">
            <Image src={`${domain}/images/points.png`} />
            <Text>{user.points || 0}</Text>
          </View>
        </>
      )}
      {!user && (
        <>
          <View
            className="title"
            onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}>
            <View className="title-text-1">GO FARM 会员</View>
            <View className="title-text-2">成为会员可累计积分</View>
          </View>
          <Button
            type="primary"
            size="small"
            onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}>
            注册/登录
          </Button>
        </>
      )}
    </Cell>
  );
}
