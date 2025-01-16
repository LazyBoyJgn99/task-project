import { View, Input, Button } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { userService } from '@/services/user.service';
import { RegisterParams, UserRole } from '@/types/user.types';
import './index.less';

export default function Register() {
  const [form, setForm] = useState<RegisterParams>({
    name: '',
    phone: '',
    code: '',
    role: UserRole.CONSUMER // 默认为消费者角色
  });

  const handleRegister = async () => {
    try {
      if (!form.name || !form.phone || !form.code) {
        Taro.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }

      const { token, user } = await userService.register(form);
      
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
        default:
          Taro.showToast({
            title: '无效的用户角色',
            icon: 'none'
          });
      }
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  const handleInput = (field: keyof RegisterParams, value: string) => {
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
    <View className='register'>
      <View className='register__header'>
        <View className='register__title'>任务平台</View>
        <View className='register__subtitle'>注册账号</View>
      </View>

      <View className='register__form'>
        <View className='register__item'>
          <View className='register__label'>姓名</View>
          <Input
            className='register__input'
            placeholder='请输入姓名'
            value={form.name}
            onInput={e => handleInput('name', e.detail.value)}
          />
        </View>

        <View className='register__item'>
          <View className='register__label'>手机号</View>
          <Input
            className='register__input'
            type='number'
            placeholder='请输入手机号'
            value={form.phone}
            onInput={e => handleInput('phone', e.detail.value)}
          />
        </View>

        <View className='register__item'>
          <View className='register__label'>验证码</View>
          <Input
            className='register__input'
            type='number'
            placeholder='请输入验证码'
            value={form.code}
            onInput={e => handleInput('code', e.detail.value)}
          />
        </View>

        <View className='register__roles'>
          <View 
            className={`register__role ${form.role === UserRole.CONSUMER ? 'register__role--active' : ''}`}
            onClick={() => handleRoleChange(UserRole.CONSUMER)}
          >
            我是消费者
          </View>
          <View 
            className={`register__role ${form.role === UserRole.WORKER ? 'register__role--active' : ''}`}
            onClick={() => handleRoleChange(UserRole.WORKER)}
          >
            我是接单者
          </View>
        </View>
      </View>

      <Button className='register__button' onClick={handleRegister}>
        注册
      </Button>

      <View className='register__login' onClick={() => Taro.navigateBack()}>
        已有账号？返回登录
      </View>
    </View>
  );
} 