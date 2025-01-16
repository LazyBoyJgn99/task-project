import { View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { taskService } from '@/services/task.service';
import { Task, TaskPageParams } from '@/types/task.types';
import TaskCard from '@/components/TaskCard';
import './index.less';

export default function TaskHistory() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageParams, setPageParams] = useState<TaskPageParams>({
    pageNumber: 1,
    pageSize: 10
  });

  useEffect(() => {
    loadTasks();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    setPageParams(prev => ({ ...prev, pageNumber: 1 }));
    setTasks([]);
    await loadTasks(true);
    Taro.stopPullDownRefresh();
  });

  // 上拉加载更多
  useReachBottom(() => {
    if (hasMore && !loading) {
      setPageParams(prev => ({
        ...prev,
        pageNumber: prev.pageNumber + 1
      }));
      loadTasks();
    }
  });

  const loadTasks = async (isRefresh = false) => {
    try {
      setLoading(true);
      const result = await taskService.getMyPublished(pageParams);
      
      if (isRefresh) {
        setTasks(result.items);
      } else {
        setTasks(prev => [...prev, ...result.items]);
      }

      setHasMore(result.items.length === pageParams.pageSize);
    } catch (error) {
      console.error('加载任务失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    Taro.navigateTo({
      url: `/pages/consumer/task-detail/index?id=${taskId}`
    });
  };

  return (
    <View className='task-history'>
      <View className='task-history__list'>
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={handleTaskClick}
          />
        ))}
      </View>
      
      {loading && (
        <View className='task-history__loading'>加载中...</View>
      )}
      
      {!hasMore && tasks.length > 0 && (
        <View className='task-history__no-more'>没有更多了</View>
      )}
      
      {!loading && tasks.length === 0 && (
        <View className='task-history__empty'>暂无任务</View>
      )}
    </View>
  );
} 