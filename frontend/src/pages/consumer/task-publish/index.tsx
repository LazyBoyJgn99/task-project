import { View, Input, Textarea, Button, Picker } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { taskService } from '@/services/task.service';
import { CreateTaskParams } from '@/types/task.types';
import './index.less';

export default function TaskPublish() {
  const [form, setForm] = useState<CreateTaskParams>({
    title: '',
    description: '',
    price: 0,
    deadline: ''
  });

  const handlePublish = async () => {
    try {
      // 表单验证
      if (!form.title || !form.description || !form.price || !form.deadline) {
        Taro.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }

      // 发布任务
      await taskService.create(form);

      Taro.showToast({
        title: '发布成功',
        icon: 'success'
      });

      // 返回首页
      Taro.navigateBack();
    } catch (error) {
      console.error('发布任务失败:', error);
    }
  };

  const handleInput = (field: keyof CreateTaskParams, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'price' ? Number(value) : value
    }));
  };

  const handleDateChange = (e: any) => {
    handleInput('deadline', e.detail.value);
  };

  return (
    <View className='task-publish'>
      <View className='task-publish__form'>
        <View className='task-publish__item'>
          <View className='task-publish__label'>任务标题</View>
          <Input
            className='task-publish__input'
            placeholder='请输入任务标题'
            value={form.title}
            onInput={e => handleInput('title', e.detail.value)}
          />
        </View>

        <View className='task-publish__item'>
          <View className='task-publish__label'>任务描述</View>
          <Textarea
            className='task-publish__textarea'
            placeholder='请输入任务描述'
            value={form.description}
            onInput={e => handleInput('description', e.detail.value)}
          />
        </View>

        <View className='task-publish__item'>
          <View className='task-publish__label'>任务价格</View>
          <Input
            className='task-publish__input'
            type='digit'
            placeholder='请输入任务价格'
            value={form.price ? String(form.price) : ''}
            onInput={e => handleInput('price', e.detail.value)}
          />
        </View>

        <View className='task-publish__item'>
          <View className='task-publish__label'>截止日期</View>
          <Picker
            mode='date'
            value={form.deadline}
            onChange={handleDateChange}
            start={new Date().toISOString().split('T')[0]}
          >
            <View className={`task-publish__picker ${form.deadline ? '' : 'task-publish__picker--placeholder'}`}>
              {form.deadline || '请选择截止日期'}
            </View>
          </Picker>
        </View>
      </View>

      <Button className='task-publish__button' onClick={handlePublish}>
        发布任务
      </Button>
    </View>
  );
} 