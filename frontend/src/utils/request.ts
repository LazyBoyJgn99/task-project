import Taro from '@tarojs/taro';
import { API_CONFIG } from '@/config/api.config';

interface RequestOptions extends Omit<Taro.request.Option, 'url'> {
  path: string;
  mock?: boolean; // 是否强制使用 mock
  mockData?: any; // mock 数据
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const request = async <T = any>(options: RequestOptions): Promise<T> => {
  const { path, mock, mockData, ...restOptions } = options;
  const useMock = mock ?? API_CONFIG.useMock;
  
  // 如果使用 mock 且提供了 mock 数据，直接返回
  if (useMock && mockData) {
    return Promise.resolve(mockData);
  }

  const baseUrl = useMock ? API_CONFIG.mockBaseUrl : API_CONFIG.baseUrl;
  
  try {
    const token = Taro.getStorageSync('token');
    const response = await Taro.request<ApiResponse<T>>({
      url: `${baseUrl}${path}`,
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        ...restOptions.header,
      },
      ...restOptions,
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      const { code, message, data } = response.data;
      
      if (code === 200) {
        return data;
      }
      
      throw new Error(message || '请求失败');
    }

    throw new Error(response.data?.message || '请求失败');
  } catch (error) {
    Taro.showToast({
      title: error.message || '网络错误',
      icon: 'none'
    });
    throw error;
  }
};
