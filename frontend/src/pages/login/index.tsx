import { View, Input, Button } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { userService } from '@/services/user.service';
import { LoginParams, UserRole } from '@/types/user.types';
import './index.less';

export default function Login() {
  const [form, setForm] = useState<LoginParams>({
    phone: '',
    role: UserRole.CONSUMER // 默认为消费者角色
  });

  const handleLogin = async () => {
    try {
      if (!form.phone) {
        Taro.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }

      const { token, user } = await userService.login(form);
      
      // 存储登录信息
      Taro.setStorageSync('token', token);
      Taro.setStorageSync('user', user);

      // 根据角色跳转到不同页面
      switch (user.role) {
        case UserRole.CONSUMER:
          Taro.reLaunch({ url: '/pages/consumer/home/index' });
          break;
        case UserRole.WORKER:
          Taro.reLaunch({ url: '/pages/worker/task-list/index' });
          break;
        case UserRole.ADMIN:
          Taro.reLaunch({ url: '/pages/admin/user-list/index' });
          break;
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  const handleInput = (field: keyof LoginParams, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setForm(prev => ({
      ...prev,
      role
    }));
  };

  return (
    <View className='login'>
      <View className='login__header'>
        <View className='login__title'>任务平台</View>
        <View className='login__subtitle'>登录账号</View>
      </View>

      <View className='login__form'>
        <View className='login__item'>
          <View className='login__label'>手机号</View>
          <Input
            className='login__input'
            type='number'
            placeholder='请输入手机号'
            value={form.phone}
            onInput={e => handleInput('phone', e.detail.value)}
          />
        </View>

        <View className='login__roles'>
          <View 
            className={`login__role ${form.role === UserRole.CONSUMER ? 'login__role--active' : ''}`}
            onClick={() => handleRoleChange(UserRole.CONSUMER)}
          >
            我是消费者
          </View>
          <View 
            className={`login__role ${form.role === UserRole.WORKER ? 'login__role--active' : ''}`}
            onClick={() => handleRoleChange(UserRole.WORKER)}
          >
            我是接单者
          </View>
          <View 
            className={`login__role ${form.role === UserRole.ADMIN ? 'login__role--active' : ''}`}
            onClick={() => handleRoleChange(UserRole.ADMIN)}
          >
            我是管理员
          </View>
        </View>
      </View>

      <Button className='login__button' onClick={handleLogin}>
        登录
      </Button>

      <View className='login__register' onClick={() => Taro.navigateTo({ url: '/pages/register/index' })}>
        还没有账号？立即注册
      </View>
    </View>
  );
}
