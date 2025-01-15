import { Provider } from 'react-redux';
import store from './store';
import './iconfont/iconfont.css';
import './app.less';

/**
 * iconfont自定义图标导入
 * icon管理：https://www.iconfont.cn/manage/index
 */

function App(props) {
  return <Provider store={store}>{props.children}</Provider>;
}

export default App;
