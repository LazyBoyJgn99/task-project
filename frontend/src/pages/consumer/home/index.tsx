import { View, Image, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { taskService } from '@/services/task.service';
import { Task } from '@/types/task.types';
import { User } from '@/types/user.types';
import TaskCard from '@/components/TaskCard';
import './index.less';

export default function ConsumerHome() {
  const [user, setUser] = useState<User>();
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    const userInfo = Taro.getStorageSync('user');
    setUser(userInfo);
    loadRecentTasks();
  }, []);

  const loadRecentTasks = async () => {
    try {
      const result = await taskService.getMyPublished({
        pageNumber: 1,
        pageSize: 3
      });
      setRecentTasks(result.items);
    } catch (error) {
      console.error('加载最近任务失败:', error);
    }
  };

  const handlePublishTask = () => {
    Taro.navigateTo({ url: '/pages/consumer/task-publish/index' });
  };

  const handleViewHistory = () => {
    Taro.navigateTo({ url: '/pages/consumer/task-history/index' });
  };

  const handleEditProfile = () => {
    Taro.navigateTo({ url: '/pages/consumer/profile-edit/index' });
  };

  if (!user) return null;

  return (
    <View className='home'>
      {/* 顶部用户信息 */}
      <View className='home__header'>
        <View className='home__user-info' onClick={handleEditProfile}>
          <Image className='home__avatar' src={user.avatar || '/assets/default-avatar.png'} />
          <View className='home__user-detail'>
            <Text className='home__username'>{user.name}</Text>
            <Text className='home__phone'>{user.phone}</Text>
          </View>
        </View>
      </View>

      {/* 功能区 */}
      <View className='home__actions'>
        <View className='home__action-item' onClick={handlePublishTask}>
          <Image className='home__action-icon' src='/assets/icons/publish.svg' />
          <Text className='home__action-text'>发布任务</Text>
        </View>
        <View className='home__action-item' onClick={handleViewHistory}>
          <Image className='home__action-icon' src='/assets/icons/history.svg' />
          <Text className='home__action-text'>历史任务</Text>
        </View>
      </View>

      {/* 广告栏 */}
      <View className='home__banner'>
        <Image className='home__banner-image' src='/assets/banner.png' mode='aspectFill' />
      </View>

      {/* 最近任务 */}
      <View className='home__recent'>
        <View className='home__section-title'>
          <Text>最近发布</Text>
          <Text className='home__more' onClick={handleViewHistory}>查看更多</Text>
        </View>
        <View className='home__task-list'>
          {recentTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      </View>
    </View>
  );
} 