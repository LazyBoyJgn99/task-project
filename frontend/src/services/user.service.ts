import { LoginParams, LoginResult, RegisterParams, UpdateUserParams, User, UserRole, UserStatus } from '@/types/user.types';
import { request } from '@/utils/request';

// Mock 数据
const mockUsers = {
  [UserRole.CONSUMER]: {
    id: 'mock-consumer',
    name: '测试用户',
    phone: '13800138000',
    role: UserRole.CONSUMER,
    status: UserStatus.ACTIVE,
    points: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  [UserRole.WORKER]: {
    id: 'mock-worker',
    name: '测试接单员',
    phone: '13800138001',
    role: UserRole.WORKER,
    status: UserStatus.ACTIVE,
    points: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  [UserRole.ADMIN]: {
    id: 'mock-admin',
    name: '测试管理员',
    phone: '13800138002',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

class UserService {
  // 登录
  async login(params: LoginParams): Promise<LoginResult> {
    const res = request<LoginResult>({
        path: '/user/login',
        method: 'POST',
        data: params,
        mockData: {
          token: 'mock-token-' + params.role,
          user: mockUsers[params.role]
        }
      })
    return res;
  }

  // 注册
  async register(params: RegisterParams): Promise<LoginResult> {
    return request<LoginResult>({
      path: '/user/register',
      method: 'POST',
      data: params,
      mockData: {
        token: 'mock-token-' + params.role,
        user: {
          ...mockUsers[params.role],
          phone: params.phone,
          name: params.name
        }
      }
    });
  }

  // 获取用户信息
  async getUserInfo(): Promise<User> {
    return request<User>({
      path: '/user/info',
      method: 'GET',
      mockData: mockUsers[UserRole.CONSUMER]
    });
  }

  // 更新用户信息
  async updateUserInfo(params: UpdateUserParams): Promise<User> {
    return request<User>({
      path: '/user/update',
      method: 'PUT',
      data: params,
      mockData: {
        ...mockUsers[UserRole.CONSUMER],
        ...params
      }
    });
  }

  // 更新个人信息
  async updateProfile(params: UpdateUserParams): Promise<User> {
    return request<User>({
      path: '/admin/user',
      method: 'PUT',
      data: params,
      mockData: {
        ...mockUsers[UserRole.CONSUMER],
        ...params,
        updatedAt: new Date().toISOString()
      }
    });
  }
}

export const userService = new UserService(); 