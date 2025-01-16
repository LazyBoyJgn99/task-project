# 接口文档

## 1. 用户模块
### 1.1 用户登录
- 路径: `/user/login`
- 方法: `POST`
- 权限: 公开
- 请求体:
```typescript
{
  username: string;  // 用户名
  password: string;  // 密码
}
```

## 2. 任务模块
### 2.1 创建任务
- 路径: `/task`
- 方法: `POST`
- 权限: 需要消费者角色
- 请求体:
```typescript
{
  title: string;       // 任务标题
  description: string; // 任务描述
  price: number;       // 任务价格
  deadline: Date;      // 截止日期
}
```

### 2.2 获取我发布的任务
- 路径: `/task/my-published`
- 方法: `GET`
- 权限: 需要消费者角色
- 查询参数:
```typescript
{
  pageNumber?: number;  // 页码，默认1
  pageSize?: number;    // 每页数量，默认10
  status?: TaskStatus;  // 任务状态
  keyword?: string;     // 搜索关键词
  minPrice?: number;    // 最低价格
  maxPrice?: number;    // 最高价格
}
```

### 2.3 获取我接到的任务
- 路径: `/task/my-accepted`
- 方法: `GET`
- 权限: 需要工作者角色
- 查询参数: 同上

### 2.4 获取任务详情
- 路径: `/task/detail`
- 方法: `GET`
- 权限: 所有已登录用户
- 查询参数:
```typescript
{
  id: string;  // 任务ID
}
```

### 2.5 接受任务
- 路径: `/task/accept`
- 方法: `PUT`
- 权限: 需要工作者角色
- 请求体:
```typescript
{
  taskId: string;  // 任务ID
}
```

### 2.6 完成任务
- 路径: `/task/complete`
- 方法: `PUT`
- 权限: 需要工作者角色
- 请求体:
```typescript
{
  taskId: string;  // 任务ID
}
```

## 3. 订单模块
### 3.1 创建订单
- 路径: `/order`
- 方法: `POST`
- 权限: 需要消费者角色
- 请求体:
```typescript
{
  taskId: string;  // 任务ID
}
```

### 3.2 获取我的消费订单
- 路径: `/order/my-consumer`
- 方法: `GET`
- 权限: 需要消费者角色
- 查询参数:
```typescript
{
  pageNumber?: number;    // 页码，默认1
  pageSize?: number;      // 每页数量，默认10
  status?: OrderStatus;   // 订单状态
}
```

### 3.3 获取我的工作订单
- 路径: `/order/my-worker`
- 方法: `GET`
- 权限: 需要工作者角色
- 查询参数: 同上

### 3.4 支付订单
- 路径: `/order/pay`
- 方法: `PUT`
- 权限: 需要消费者角色
- 请求体:
```typescript
{
  orderId: string;  // 订单ID
}
```

### 3.5 完成订单
- 路径: `/order/complete`
- 方法: `PUT`
- 权限: 需要消费者角色
- 请求体:
```typescript
{
  orderId: string;  // 订单ID
}
```

### 3.6 取消订单
- 路径: `/order/cancel`
- 方法: `PUT`
- 权限: 需要消费者角色
- 请求体:
```typescript
{
  orderId: string;  // 订单ID
}
```

### 3.7 申请退款
- 路径: `/order/refund`
- 方法: `PUT`
- 权限: 需要消费者角色
- 请求体:
```typescript
{
  orderId: string;  // 订单ID
}
```

## 4. 管理员模块
### 4.1 查询用户列表
- 路径: `/admin/users`
- 方法: `GET`
- 权限: 需要管理员角色
- 查询参数:
```typescript
{
  // 用户查询参数
}
```

### 4.2 更新用户信息
- 路径: `/admin/user`
- 方法: `PUT`
- 权限: 需要管理员角色
- 请求体:
```typescript
{
  id: string;           // 用户ID
  name?: string;        // 用户名
  status?: UserStatus;  // 用户状态
}
```

### 4.3 查询任务列表
- 路径: `/admin/tasks`
- 方法: `GET`
- 权限: 需要管理员角色

## 5. 优惠券模块
### 5.1 查询优惠券
- 路径: `/coupon`
- 方法: `GET`
- 查询参数:
```typescript
{
  userId?: string;  // 用户ID
  name?: string;    // 优惠券名称
}
```

### 5.2 查询优惠券详情
- 路径: `/coupon/detail`
- 方法: `GET`
- 查询参数:
```typescript
{
  id: string;  // 优惠券ID
}
```

## 6. 卡券模块
### 6.1 使用卡券
- 路径: `/gift/use`
- 方法: `POST`
- 请求体:
```typescript
{
  // 卡券使用参数
}
```

### 6.2 查询卡券
- 路径: `/gift`
- 方法: `GET`
- 查询参数:
```typescript
{
  // 卡券查询参数
}
```

### 6.3 查询卡券详情
- 路径: `/gift/detail`
- 方法: `GET`
- 查询参数:
```typescript
{
  // 卡券详情查询参数
}
```

## 7. 商品模块
### 7.1 新增商品
- 路径: `/commodity`
- 方法: `POST`
- 请求体:
```typescript
{
  // 商品添加参数
}
```

### 7.2 删除商品
- 路径: `/commodity`
- 方法: `DELETE`
- 查询参数:
```typescript
{
  id: string;  // 商品ID
}
```

### 7.3 更新商品
- 路径: `/commodity`
- 方法: `PATCH`
- 请求体:
```typescript
{
  // 商品更新参数
}
```

### 7.4 查询商品
- 路径: `/commodity`
- 方法: `GET`
- 查询参数:
```typescript
{
  // 商品查询参数
}
```

### 7.5 分页查询商品
- 路径: `/commodity/page`
- 方法: `GET`
- 查询参数:
```typescript
{
  // 分页查询参数
}
```

### 7.6 新增某日的门票
- 路径: `/commodity/add-tickets-by-date`
- 方法: `POST`
- 权限: 公开
- 请求体:
```typescript
{
  date: string;    // 日期
  status: string;  // 状态
}
```

### 7.7 查询某日之后的商品
- 路径: `/commodity/by-date`
- 方法: `GET`
- 查询参数:
```typescript
{
  // 日期查询参数
}
```

## 通用说明

### 权限说明
- `@Public()`: 公开接口，无需认证
- `@Roles(UserRole.CONSUMER)`: 需要消费者角色
- `@Roles(UserRole.WORKER)`: 需要工作者角色
- `@Roles(UserRole.ADMIN)`: 需要管理员角色
- 其他接口默认需要登录

### 状态码
- 200: 成功
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 500: 服务器内部错误

### 分页返回格式
```typescript
{
  items: T[];           // 数据列表
  total: number;        // 总数
  pageNumber: number;   // 当前页码
  pageSize: number;     // 每页数量
}
```

### 认证方式
- 使用 JWT Token
- Token 需要在请求头中携带：`Authorization: Bearer <token>` 