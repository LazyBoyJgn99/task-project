// 用户角色
export enum UserRole {
  ADMIN = 'ADMIN',
  CONSUMER = 'CONSUMER',
  WORKER = 'WORKER'
}

// 用户状态
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

// 用户信息
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  points?: number;
  createdAt: string;
  updatedAt: string;
}

// 登录参数
export interface LoginParams {
  phone: string;
  role: UserRole;
}

// 登录返回结果
export interface LoginResult {
  token: string;
  user: User;
}

// 注册参数
export interface RegisterParams {
  name: string;
  phone: string;
  code: string;
  role: UserRole;
}

// 更新用户参数
export interface UpdateUserParams {
  name?: string;
  phone?: string;
  avatar?: string;
} 