import { View, Text } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import { adminService } from '@/services/admin.service';
import { User, UserRole, UserStatus } from '@/types/user.types';
import './index.less';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadUsers();
    Taro.stopPullDownRefresh();
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.queryUsers({});
      setUsers(result);
    } catch (error) {
      console.error('加载用户列表失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    try {
      await adminService.updateUser({
        id: userId,
        status
      });
      await loadUsers();
      Taro.showToast({
        title: '更新成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('更新用户状态失败:', error);
    }
  };

  const getRoleText = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return '管理员';
      case UserRole.CONSUMER:
        return '消费者';
      case UserRole.WORKER:
        return '接单者';
      default:
        return '未知角色';
    }
  };

  const getStatusText = (status: UserStatus): string => {
    switch (status) {
      case UserStatus.ACTIVE:
        return '正常';
      case UserStatus.INACTIVE:
        return '未激活';
      case UserStatus.BANNED:
        return '已封禁';
      default:
        return '未知状态';
    }
  };

  if (loading) {
    return (
      <View className='user-list__loading'>加载中...</View>
    );
  }

  return (
    <View className='user-list'>
      {users.map(user => (
        <View key={user.id} className='user-list__item'>
          <View className='user-list__info'>
            <View className='user-list__header'>
              <Text className='user-list__name'>{user.name}</Text>
              <Text className={`user-list__role user-list__role--${user.role.toLowerCase()}`}>
                {getRoleText(user.role)}
              </Text>
            </View>
            
            <View className='user-list__detail'>
              <Text className='user-list__phone'>{user.phone}</Text>
              <Text className={`user-list__status user-list__status--${user.status.toLowerCase()}`}>
                {getStatusText(user.status)}
              </Text>
            </View>

            <View className='user-list__time'>
              <Text className='user-list__label'>注册时间：</Text>
              <Text>{user.createdAt}</Text>
            </View>
          </View>

          <View className='user-list__actions'>
            {user.status !== UserStatus.BANNED && (
              <View 
                className='user-list__button user-list__button--ban'
                onClick={() => handleStatusChange(user.id, UserStatus.BANNED)}
              >
                封禁
              </View>
            )}
            {user.status === UserStatus.BANNED && (
              <View 
                className='user-list__button user-list__button--activate'
                onClick={() => handleStatusChange(user.id, UserStatus.ACTIVE)}
              >
                解封
              </View>
            )}
          </View>
        </View>
      ))}

      {!loading && users.length === 0 && (
        <View className='user-list__empty'>暂无用户</View>
      )}
    </View>
  );
} 