import { View, Image, Text } from '@tarojs/components';
import { Progress } from '@nutui/nutui-react-taro';
import { domain } from '@/utils/request';
import { IUser } from '@/types/user';
import './card-vip.less';

export default function Index(props: IProps) {
  return (
    <View className="card-vip">
      <Image
        className="vip-background"
        src={`${domain}/images/mine-background.png`}
      />
      <View className="vip-info">
        <View className="left">
          <View className="level">V{props.level}</View>
          <View className="level-name">动物饲养员</View>
          {props.level <= props.user.level && (
            <View className="level-points">
              <Progress
                percent={Math.min(
                  (props.user.points / props.points) * 100,
                  100
                )}
                strokeWidth="4"
                color="linear-gradient(135deg, #C8CED3 0%, #394856 100%)"
              />
              <View className="points-wrap">
                <Image
                  className="points-icon"
                  src={`${domain}/images/points.png`}
                />
                <Text className="points-text">
                  {props.level === 4 && props.user.level === 4
                    ? props.user.points
                    : `${Math.min(props.user.points || 0, props.points)}/${
                        props.points
                      }`}
                </Text>
              </View>
            </View>
          )}
          {props.level > props.user.level && (
            <View className="level-no-reached">可享v{props.level}晋级好礼</View>
          )}
        </View>
        <View className="right">
          <Image className="vip-pic" src={`${domain}/images/vip-pic.png`} />
        </View>
      </View>
      {props.isCurrentLevel && <View className="current-level">当前等级</View>}
    </View>
  );
}

interface IProps {
  user: IUser;
  level: number;
  isCurrentLevel: boolean;
  points: number;
}
