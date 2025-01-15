import Taro from '@tarojs/taro';
import { IUser } from '@/types/user';
import request from './request';

export function getUser() {
  return Taro.getStorageSync('user') as IUser;
}

export function setUser(user: IUser) {
  Taro.setStorageSync('user', user);
}

export function removeUser() {
  Taro.removeStorageSync('user');
}

export function getToken() {
  return Taro.getStorageSync('access_token');
}

export function setToken(token: string) {
  Taro.setStorageSync('access_token', token);
}

export function removeToken() {
  Taro.removeStorageSync('access_token');
}

export const fetchUser = async (id: string) => {
  const user = await request.get<IUser>('/user/detail', { id });
  setUser(user);
  return user || {};
};
