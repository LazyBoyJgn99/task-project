import { Avatar, Button } from '@nutui/nutui-react-taro';
import { View, Image, Text } from '@tarojs/components';
import { IconFont } from '@nutui/icons-react-taro';
import { IUser } from '@/types/user';
import { domain } from '@/utils/request';
import Taro from '@tarojs/taro';
import './card-user.less';

interface IProps {
  user: IUser;
}

const excitationTextGenetater = (points: number) => {
  if (points >= 3000) {
    return 'GO FARM 欢迎您v4会员';
  } else if (points >= 1000) {
    return `再得${3000 - points}积分 升级v4会员`;
  } else if (points >= 500) {
    return `再得${1000 - points}积分 升级v3会员`;
  } else {
    return `再得${500 - points}积分 升级v2会员`;
  }
};

export default function Index(props: IProps) {
  const { user } = props;

  const goLoginPage = () => {
    Taro.navigateTo({ url: '/pages/login/index' });
  };

  const goUserUpdatePage = () => {
    Taro.navigateTo({ url: `/pages/user-update/index` });
  };

  const goVIPCenterPage = () => {
    Taro.navigateTo({ url: '/pages/vip-center/index' });
  };

  return (
    <View className="mine-card-user">
      <Image src={`${domain}/images/mine-background.png`}></Image>
      {user && (
        <>
          <View className="user-avatar">
            <View className="user-info-box" onClick={goUserUpdatePage}>
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
              />
              <View className="user-info">
                <View className="user-name">{user.name}</View>
                <View className="user-level">动物饲养员 v{user.level}</View>
              </View>
            </View>
            <Button size="small" type="primary" onClick={goVIPCenterPage}>
              会员中心
            </Button>
          </View>
          <View className="user-points">
            <View className="points-number">
              <Image src={`${domain}/images/points.png`} />
              <Text className="points-text">{user.points || 0}</Text>
            </View>
            <View>{excitationTextGenetater(user.points || 0)}</View>
          </View>
        </>
      )}
      {!user && (
        <>
          <View className="user-avatar unlogin">
            <View className="user-info-box">
              <Avatar
                icon={
                  <IconFont
                    fontClassName="icon"
                    color="#a0a0a0"
                    classPrefix="go-farm"
                    name="mine"
                  />
                }
                shape="round"
                onClick={goLoginPage}
              />
              <View className="user-info" onClick={goLoginPage}>
                <View>Hello！</View>
                <View className="user-level">登录开启奇妙旅程</View>
              </View>
            </View>
            <Button size="small" type="primary" onClick={goLoginPage}>
              注册/登录
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
