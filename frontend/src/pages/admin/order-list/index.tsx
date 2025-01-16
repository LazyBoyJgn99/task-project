import { View, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import { adminService } from '@/services/admin.service';
import { Task, TaskStatus } from '@/types/task.types';
import { User } from '@/types/user.types';
import './index.less';

interface TaskWithUsers extends Omit<Task, 'consumer' | 'worker'> {
  consumer: Pick<User, 'name'>;
  worker?: Pick<User, 'name'>;
}

export default function OrderList() {
  const [tasks, setTasks] = useState<TaskWithUsers[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadTasks();
    Taro.stopPullDownRefresh();
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await adminService.queryTasks({});
      setTasks(result as TaskWithUsers[]);
    } catch (error) {
      console.error('加载订单列表失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.PENDING:
        return '待接单';
      case TaskStatus.IN_PROGRESS:
        return '进行中';
      case TaskStatus.COMPLETED:
        return '已完成';
      case TaskStatus.CANCELLED:
        return '已取消';
      default:
        return '未知状态';
    }
  };

  const getStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'pending';
      case TaskStatus.IN_PROGRESS:
        return 'progress';
      case TaskStatus.COMPLETED:
        return 'completed';
      case TaskStatus.CANCELLED:
        return 'cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <View className='order-list__loading'>加载中...</View>
    );
  }

  return (
    <View className='order-list'>
      {tasks.map(task => (
        <View key={task.id} className='order-list__item'>
          <View className='order-list__header'>
            <Text className='order-list__title'>{task.title}</Text>
            <Text className={`order-list__status order-list__status--${getStatusClass(task.status)}`}>
              {getStatusText(task.status)}
            </Text>
          </View>

          <View className='order-list__info'>
            <View className='order-list__row'>
              <Text className='order-list__label'>发布者：</Text>
              <Text className='order-list__value'>{task.consumer.name}</Text>
            </View>
            {task.worker && (
              <View className='order-list__row'>
                <Text className='order-list__label'>接单者：</Text>
                <Text className='order-list__value'>{task.worker.name}</Text>
              </View>
            )}
            <View className='order-list__row'>
              <Text className='order-list__label'>金额：</Text>
              <Text className='order-list__price'>¥{task.price}</Text>
            </View>
            <View className='order-list__row'>
              <Text className='order-list__label'>截止时间：</Text>
              <Text className='order-list__value'>{task.deadline}</Text>
            </View>
            <View className='order-list__row'>
              <Text className='order-list__label'>创建时间：</Text>
              <Text className='order-list__value'>{task.createdAt}</Text>
            </View>
          </View>

          <View className='order-list__description'>
            <Text className='order-list__label'>任务描述：</Text>
            <Text className='order-list__content'>{task.description}</Text>
          </View>
        </View>
      ))}

      {!loading && tasks.length === 0 && (
        <View className='order-list__empty'>暂无订单</View>
      )}
    </View>
  );
} 