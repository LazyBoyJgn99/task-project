import { View, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { taskService } from '@/services/task.service';
import { Task, TaskStatus } from '@/types/task.types';
import './index.less';

export default function TaskDetail() {
  const router = useRouter();
  const [task, setTask] = useState<Task>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.params.id) {
      loadTask();
    }
  }, [router.params.id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const result = await taskService.getDetail({ id: router.params.id as string });
      setTask(result);
    } catch (error) {
      console.error('加载任务详情失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (!task) return;
      await taskService.cancel(task.id);
      await loadTask();
      Taro.showToast({
        title: '取消成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('取消任务失败:', error);
    }
  };

  if (loading || !task) return null;

  return (
    <View className='task-detail'>
      <View className='task-detail__header'>
        <Text className='task-detail__title'>{task.title}</Text>
        <Text className='task-detail__price'>￥{task.price}</Text>
      </View>

      <View className='task-detail__content'>
        <View className='task-detail__section'>
          <Text className='task-detail__label'>任务描述</Text>
          <Text className='task-detail__description'>{task.description}</Text>
        </View>

        <View className='task-detail__section'>
          <Text className='task-detail__label'>截止日期</Text>
          <Text className='task-detail__text'>{task.deadline}</Text>
        </View>

        <View className='task-detail__section'>
          <Text className='task-detail__label'>发布时间</Text>
          <Text className='task-detail__text'>{task.createdAt}</Text>
        </View>

        <View className='task-detail__section'>
          <Text className='task-detail__label'>任务状态</Text>
          <Text className={`task-detail__status task-detail__status--${task.status.toLowerCase()}`}>
            {getStatusText(task.status)}
          </Text>
        </View>

        {task.worker && (
          <View className='task-detail__section'>
            <Text className='task-detail__label'>接单者</Text>
            <View className='task-detail__worker'>
              <Text className='task-detail__worker-name'>{task.worker.name}</Text>
              <Text className='task-detail__worker-phone'>{task.worker.phone}</Text>
            </View>
          </View>
        )}
      </View>

      {task.status === TaskStatus.PENDING && (
        <View className='task-detail__footer'>
          <View className='task-detail__button task-detail__button--cancel' onClick={handleCancel}>
            取消任务
          </View>
        </View>
      )}
    </View>
  );
}

function getStatusText(status: TaskStatus): string {
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
} 