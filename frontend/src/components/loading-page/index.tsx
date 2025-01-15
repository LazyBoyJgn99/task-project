import { View, Image } from '@tarojs/components';
import { domain } from '@/utils/request';
import './index.less';

interface IProps {
  loading: boolean;
}

export default function Index(props: IProps) {
  return (
    <View
      className={props.loading ? 'loading-page' : 'loading-page loading-hide'}>
      <Image src={`${domain}/images/loading.png`} />
      <View className="loading-description">小动物们正在赶来~</View>
    </View>
  );
}
