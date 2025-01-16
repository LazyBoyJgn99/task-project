import { request } from '@/utils/request';
import { 
  CreateTaskParams,
  TaskPageParams,
  TaskDetailParams,
  Task,
  TaskPageResult,
  TaskStatus
} from '@/types/task.types';
import { UserRole, UserStatus } from '@/types/user.types';

// Mock 数据
const mockTasks: Task[] = [
  {
    id: 'mock-task-1',
    title: '测试任务1',
    description: '这是一个测试任务描述',
    price: 100,
    deadline: '2024-12-31',
    status: TaskStatus.PENDING,
    publisher: {
      id: 'mock-consumer',
      name: '测试用户',
      phone: '13800138000',
      role: UserRole.CONSUMER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
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
    publisher: {
      id: 'mock-consumer',
      name: '测试用户',
      phone: '13800138000',
      role: UserRole.CONSUMER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    worker: {
      id: 'mock-worker',
      name: '测试接单员',
      phone: '13800138001',
      role: UserRole.WORKER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const taskService = {
  // 创建任务
  create: (params: CreateTaskParams) => {
    return request<Task>({
      path: '/task',
      method: 'POST',
      data: params,
      mock: true,
      mockData: {
        id: 'mock-task-' + Date.now(),
        ...params,
        status: TaskStatus.PENDING,
        consumerId: 'mock-consumer',
        workerId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  },

  // 获取我发布的任务
  getMyPublished: (params: TaskPageParams) => {
    return request<TaskPageResult>({
      path: '/task/my-published',
      method: 'GET',
      data: params,
      mock: true,
      mockData: {
        total: mockTasks.length,
        items: mockTasks
      }
    });
  },

  // 获取我接到的任务
  getMyAccepted: (params: TaskPageParams) => {
    return request<TaskPageResult>({
      path: '/task/my-accepted',
      method: 'GET',
      data: params,
      mock: true,
      mockData: {
        total: 1,
        items: [mockTasks[1]]
      }
    });
  },

  // 获取任务详情
  getDetail: (params: TaskDetailParams) => {
    return request<Task>({
      path: '/task/detail',
      method: 'GET',
      data: params,
      mock: true,
      mockData: mockTasks[0]
    });
  },

  // 接受任务
  accept: (taskId: string) => {
    return request<Task>({
      path: '/task/accept',
      method: 'PUT',
      data: { taskId },
      mock: true,
      mockData: {
        ...mockTasks[0],
        status: TaskStatus.IN_PROGRESS,
        workerId: 'mock-worker'
      }
    });
  },

  // 完成任务
  complete: (taskId: string) => {
    return request<Task>({
      path: '/task/complete',
      method: 'PUT',
      data: { taskId },
      mock: true,
      mockData: {
        ...mockTasks[0],
        status: TaskStatus.COMPLETED
      }
    });
  },

  // 取消任务
  cancel: (taskId: string) => {
    return request<Task>({
      path: '/task/cancel',
      method: 'PUT',
      data: { taskId },
      mock: true,
      mockData: {
        ...mockTasks[0],
        status: TaskStatus.CANCELLED
      }
    });
  }
}; 