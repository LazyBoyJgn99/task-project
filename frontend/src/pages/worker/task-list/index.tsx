import { View } from '@tarojs/components';
import { useEffect, useState } from 'react';
import { taskService } from '@/services/task.service';
import { Task, TaskPageParams } from '@/types/task.types';
import TaskCard from '@/components/TaskCard';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageParams, setPageParams] = useState<TaskPageParams>({
    pageNumber: 1,
    pageSize: 10
  });

  useEffect(() => {
    loadTasks();
  }, [pageParams]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await taskService.getMyAccepted(pageParams);
      setTasks(result.items);
    } catch (error) {
      console.error('加载任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='task-list'>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </View>
  );
} 