import { RequestResult } from '@/types/request';
import Taro from '@tarojs/taro';
import { removeToken, removeUser } from './user';

interface IRequestOptions {
  hideError?: boolean;
  errorMsg?: string;
}

export const domain = 'https://gofarm.obs.cn-east-3.myhuaweicloud.com';
export const apiDomain = 'https://www.gofarm.top';
const baseUrl = `${apiDomain}/pos`;
const authorizationPrefix = 'Bearer ';

function baseRequest<T>(
  url: string,
  method: string,
  options: any,
  customOptions?: IRequestOptions
) {
  return new Promise<T>((resolve, reject) => {
    const token = Taro.getStorageSync('access_token');
    Taro.request<RequestResult<T>>({
      url: `${baseUrl}${url}`,
      method,
      header: {
        authorization: token ? authorizationPrefix + token : '',
      },
      ...options,
      success: (requestResult) => {
        // 如果成功，则返回接口返回数据
        if (requestResult.statusCode >= 200 && requestResult.statusCode < 300) {
          resolve(requestResult.data.data);
          return;
        }
        if (requestResult.statusCode === 401) {
          removeUser();
          removeToken();
          // 这里如果直接跳转会阻断request外的catch和finally逻辑，所以用定时器延迟跳转
          setTimeout(() => {
            Taro.navigateTo({
              url: '/pages/login/index',
            });
          }, 500);
          return;
        }
        // 错误提示
        if (!customOptions?.hideError) {
          Taro.showToast({
            title: customOptions?.errorMsg || '系统错误',
            icon: 'none',
          });
        }
        reject(requestResult);
      },
      fail: (requestResult: TaroGeneral.CallbackResult) => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
        reject(requestResult);
      },
    });
  });
}

const request = {
  get: <T>(url: string, data?: any, options?: IRequestOptions) =>
    baseRequest<T>(url, 'GET', { data }, options),
  post: <T>(url: string, data?: any, options?: IRequestOptions) =>
    baseRequest<T>(url, 'POST', { data }, options),
  patch: <T>(url: string, data?: any, options?: IRequestOptions) =>
    baseRequest<T>(url, 'PATCH', { data }, options),
  delete: <T>(url: string, data?: any, options?: IRequestOptions) =>
    baseRequest<T>(url, 'DELETE', { data }, options),
};
export default request;

