import Taro from '@tarojs/taro';

export function todoModule(text?: string) {
  Taro.showToast({
    title: text || '开发中，敬请期待',
    icon: 'none',
  });
}
