import { User, UserStatus } from './user.types';
import { Task } from './task.types';

// 用户查询参数
export interface UserQueryParams {
  keyword?: string;
  status?: UserStatus;
}

// 更新用户参数
export interface UpdateUserParams {
  id: string;
  name?: string;
  status?: UserStatus;
}

// 分页结果
export interface TaskPageResult {
  items: Task[];
  total: number;
  pageNumber: number;
  pageSize: number;
}

export { User, Task }; 