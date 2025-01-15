import Taro from '@tarojs/taro';

export const getUserCodeWX = () => {
  return new Promise((resolve, reject) => {
    Taro.login({
      success: async (res) => {
        resolve(res.code);
      },
      fail: (err) => {
        Taro.showToast({
          title: err.errMsg,
          icon: 'none',
        });
        reject(err);
      },
    });
  });
};
