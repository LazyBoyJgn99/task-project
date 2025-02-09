import { request } from '@/utils/request';
import { User, UserStatus, UserRole } from '@/types/user.types';
import { Task, TaskStatus } from '@/types/task.types';

interface QueryUsersParams {
  status?: UserStatus;
  role?: string;
  keyword?: string;
}

interface QueryTasksParams {
  status?: string;
  keyword?: string;
}

interface UpdateUserParams {
  id: string;
  status: UserStatus;
}

// Mock 数据
const mockUsers: User[] = [
  {
    id: 'mock-user-1',
    name: '测试用户1',
    phone: '13800138001',
    role: UserRole.CONSUMER,
    status: UserStatus.ACTIVE,
    points: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-user-2',
    name: '测试用户2',
    phone: '13800138002',
    role: UserRole.WORKER,
    status: UserStatus.ACTIVE,
    points: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockTasks: Task[] = [
  {
    id: 'mock-task-1',
    title: '测试任务1',
    description: '这是一个测试任务描述',
    price: 100,
    deadline: '2024-12-31',
    status: TaskStatus.PENDING,
    publisher: mockUsers[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-task-2',
    title: '测试任务2',
    description: '这是另一个测试任务描述',
    price: 200,
    deadline: '2024-12-31',
    status: TaskStatus.IN_PROGRESS,
    publisher: mockUsers[0],
    worker: mockUsers[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const adminService = {
  // 查询用户列表
  queryUsers: (params: QueryUsersParams) => {
    return request<User[]>({
      path: '/admin/users',
      method: 'GET',
      data: params,
      mockData: mockUsers
    });
  },

  // 更新用户状态
  updateUser: (params: UpdateUserParams) => {
    return request<User>({
      path: '/admin/users/update',
      method: 'PUT',
      data: params,
      mockData: {
        ...mockUsers[0],
        status: params.status
      }
    });
  },

  // 查询任务列表
  queryTasks: (params: QueryTasksParams) => {
    return request<Task[]>({
      path: '/admin/tasks',
      method: 'GET',
      data: params,
      mockData: mockTasks
    });
  }
}; 