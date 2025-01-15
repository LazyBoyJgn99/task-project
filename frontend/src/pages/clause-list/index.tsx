import { Cell } from '@nutui/nutui-react-taro';
import { ArrowRight } from '@nutui/icons-react-taro';
import './index.less';
import Taro from '@tarojs/taro';

export default function Index() {
  const goClauseDetailPage = (url: string) => {
    Taro.navigateTo({ url: `/pages/${url}/index` });
  };

  return (
    <Cell.Group className="clause-list">
      <Cell
        title="游客须知"
        extra={<ArrowRight size={14} />}
        onClick={() => goClauseDetailPage('clause-farm-notice')}
      />
      <Cell
        title="免责声明"
        extra={<ArrowRight size={14} />}
        onClick={() => goClauseDetailPage('clause-disclaimers')}
      />
      <Cell
        title="隐私政策"
        extra={<ArrowRight size={14} />}
        onClick={() => goClauseDetailPage('clause-privacy-policy')}
      />
    </Cell.Group>
  );
}
