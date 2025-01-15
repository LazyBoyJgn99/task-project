import { View } from '@tarojs/components';
import { IconFont } from '@nutui/icons-react-taro';
import './icon-reward.less';

export default function Index(props: IProps) {
  return (
    <View className="icon-reward">
      <IconFont
        fontClassName="icon"
        color={props.lock ? '#aeaeae' : '#006241'}
        classPrefix="go-farm"
        name={props.icon}
      />
      <View
        className="icon-reward-title"
        style={{ color: props.lock ? '#aeaeae' : '#000000' }}>
        {props.title}
      </View>
    </View>
  );
}

interface IProps {
  icon: string;
  title: string;
  lock: boolean;
}
