# API 接口文档

## 基础信息
- 基础路径: `http://localhost:3100`
- 认证方式: JWT Token
- 请求头: 需要认证的接口都要携带 `Authorization: Bearer <token>`

## 统一响应格式
所有接口返回的数据格式统一为：
```typescript
{
  code: number;     // 状态码，200表示成功
  message: string;  // 响应消息
  data: T;         // 实际数据，泛型T代表具体的数据类型
}
```

例如，登录接口的完整响应格式：
```typescript
{
  code: 200,
  message: "success",
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      phone: string;
      role: UserRole;
      status: UserStatus;
      // ...其他用户信息
    }
  }
}
```

## 用户模块 (/user)

### 1. 用户登录
- 路径: POST /user/login
- 描述: 用户登录接口
- 权限: 公开接口
- 请求体:
  ```typescript
  {
    phone: string;    // 手机号
    role: UserRole;   // 用户角色
  }
  ```

## 任务模块 (/task)

### 1. 创建任务
- 路径: POST /task
- 描述: 创建新任务
- 权限: 需要登录，仅消费者角色
- 请求体:
  ```typescript
  {
    title: string;      // 任务标题
    description: string;// 任务描述
    price: number;      // 任务价格
    deadline: string;   // 截止日期
  }
  ```

### 2. 获取我发布的任务
- 路径: GET /task/my-published
- 描述: 获取当前用户发布的任务列表
- 权限: 需要登录，仅消费者角色
- 查询参数:
  ```typescript
  {
    pageNumber?: number; // 页码
    pageSize?: number;   // 每页数量
  }
  ```

### 3. 获取我接到的任务
- 路径: GET /task/my-accepted
- 描述: 获取当前用户接到的任务列表
- 权限: 需要登录，仅工作者角色
- 查询参数: 同上

### 4. 获取任务详情
- 路径: GET /task/detail
- 描述: 获取任务详细信息
- 权限: 需要登录
- 查询参数:
  ```typescript
  {
    id: string;  // 任务ID
  }
  ```

### 5. 接受任务
- 路径: PUT /task/accept
- 描述: 工作者接受任务
- 权限: 需要登录，仅工作者角色
- 请求体:
  ```typescript
  {
    taskId: string;  // 任务ID
  }
  ```

### 6. 完成任务
- 路径: PUT /task/complete
- 描述: 工作者标记任务完成
- 权限: 需要登录，仅工作者角色
- 请求体:
  ```typescript
  {
    taskId: string;  // 任务ID
  }
  ```

## 管理员模块 (/admin)

### 1. 查询用户列表
- 路径: GET /admin/users
- 描述: 获取所有用户列表
- 权限: 需要登录，仅管理员角色
- 查询参数:
  ```typescript
  {
    status?: UserStatus;  // 用户状态
    role?: string;        // 用户角色
    keyword?: string;     // 搜索关键词
  }
  ```

### 2. 更新用户信息
- 路径: PUT /admin/user
- 描述: 更新用户信息
- 权限: 需要登录，仅管理员角色
- 请求体:
  ```typescript
  {
    id: string;          // 用户ID
    status: UserStatus;  // 用户状态
  }
  ```

### 3. 查询任务列表
- 路径: GET /admin/tasks
- 描述: 获取所有任务列表
- 权限: 需要登录，仅管理员角色

## 数据类型定义

### 用户角色
```typescript
enum UserRole {
  CONSUMER = 'consumer',  // 消费者
  WORKER = 'worker',      // 工作者
  ADMIN = 'admin'         // 管理员
}
```

### 用户状态
```typescript
enum UserStatus {
  ACTIVE = 'active',      // 正常
  INACTIVE = 'inactive'   // 禁用
}
```

### 任务状态
```typescript
enum TaskStatus {
  PENDING = 'pending',         // 待接单
  IN_PROGRESS = 'inProgress',  // 进行中
  COMPLETED = 'completed',     // 已完成
  CANCELLED = 'cancelled'      // 已取消
}
```

## 在线文档
你可以通过访问 `/api-docs` 路径查看 Swagger 在线 API 文档。 