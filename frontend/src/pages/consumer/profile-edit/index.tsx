import { View, Input, Button } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { userService } from '@/services/user.service';
import { User, UpdateUserParams } from '@/types/user.types';
import './index.less';

export default function ProfileEdit() {
  const [form, setForm] = useState<UpdateUserParams>(() => {
    const user: User = Taro.getStorageSync('user');
    return {
      name: user.name,
      phone: user.phone
    };
  });

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.phone) {
        Taro.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }

      // 更新用户信息
      const updatedUser = await userService.updateProfile(form);
      
      // 更新本地存储
      Taro.setStorageSync('user', updatedUser);

      Taro.showToast({
        title: '更新成功',
        icon: 'success'
      });

      // 返回上一页
      Taro.navigateBack();
    } catch (error) {
      console.error('更新个人信息失败:', error);
    }
  };

  const handleInput = (field: keyof UpdateUserParams, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <View className='profile-edit'>
      <View className='profile-edit__form'>
        <View className='profile-edit__item'>
          <View className='profile-edit__label'>姓名</View>
          <Input
            className='profile-edit__input'
            placeholder='请输入姓名'
            value={form.name}
            onInput={e => handleInput('name', e.detail.value)}
          />
        </View>

        <View className='profile-edit__item'>
          <View className='profile-edit__label'>手机号</View>
          <Input
            className='profile-edit__input'
            type='number'
            placeholder='请输入手机号'
            value={form.phone}
            onInput={e => handleInput('phone', e.detail.value)}
          />
        </View>
      </View>

      <Button className='profile-edit__button' onClick={handleSubmit}>
        保存
      </Button>
    </View>
  );
} 