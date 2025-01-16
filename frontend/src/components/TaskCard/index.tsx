import { View, Text } from '@tarojs/components';
import { Task } from '@/types/task.types';
import './index.less';

interface Props {
  task: Task;
  onClick?: (taskId: string) => void;
}

export default function TaskCard({ task, onClick }: Props) {
  const { id, title, description, price, status, deadline } = task;

  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <View className='task-card' onClick={handleClick}>
      <View className='task-card__header'>
        <Text className='task-card__title'>{title}</Text>
        <Text className='task-card__price'>￥{price}</Text>
      </View>
      
      <View className='task-card__content'>
        <Text className='task-card__description'>{description}</Text>
        <Text className='task-card__deadline'>截止日期: {deadline}</Text>
      </View>

      <View className='task-card__footer'>
        <Text className='task-card__status'>{status}</Text>
      </View>
    </View>
  );
} 