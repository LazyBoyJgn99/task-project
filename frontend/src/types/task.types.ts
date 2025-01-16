import { User } from './user.types';

// 任务状态
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// 任务信息
export interface Task {
  id: string;
  title: string;
  description: string;
  price: number;
  deadline: string;
  status: TaskStatus;
  publisher: User;
  worker?: User;
  createdAt: string;
  updatedAt: string;
}

// 创建任务参数
export interface CreateTaskParams {
  title: string;
  description: string;
  price: number;
  deadline: string;
}

// 任务查询参数
export interface TaskPageParams {
  pageNumber: number;
  pageSize: number;
  status?: TaskStatus;
}

// 任务详情参数
export interface TaskDetailParams {
  id: string;
}

// 分页结果
export interface TaskPageResult {
  items: Task[];
  total: number;
  pageNumber: number;
  pageSize: number;
} 