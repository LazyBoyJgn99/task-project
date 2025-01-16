import { View, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import { useRouter } from '@tarojs/taro';
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
      const taskId = router.params.id;
      if (!taskId) return;
      const result = await taskService.getDetail({ id: taskId });
      setTask(result);
    } catch (error) {
      console.error('加载任务详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!task) return;
    try {
      await taskService.accept(task.id);
      await loadTask();
    } catch (error) {
      console.error('接受任务失败:', error);
    }
  };

  const handleComplete = async () => {
    if (!task) return;
    try {
      await taskService.complete(task.id);
      await loadTask();
    } catch (error) {
      console.error('完成任务失败:', error);
    }
  };

  if (!task) return null;

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
          <Text className='task-detail__label'>发布者</Text>
          <Text className='task-detail__text'>{task.publisher.name}</Text>
        </View>

        {task.worker && (
          <View className='task-detail__section'>
            <Text className='task-detail__label'>接单者</Text>
            <Text className='task-detail__text'>{task.worker.name}</Text>
          </View>
        )}

        <View className='task-detail__section'>
          <Text className='task-detail__label'>状态</Text>
          <Text className='task-detail__status'>{task.status}</Text>
        </View>
      </View>

      <View className='task-detail__footer'>
        {task.status === TaskStatus.PENDING && (
          <View className='task-detail__button' onClick={handleAccept}>
            接受任务
          </View>
        )}
        {task.status === TaskStatus.IN_PROGRESS && task.worker?.id === 'currentUserId' && (
          <View className='task-detail__button' onClick={handleComplete}>
            完成任务
          </View>
        )}
      </View>
    </View>
  );
} 