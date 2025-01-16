export default defineAppConfig({
  pages: [
    // 公共页面
    'pages/login/index',
    'pages/register/index',

    // 消费者端
    'pages/consumer/home/index',
    'pages/consumer/profile-edit/index',
    'pages/consumer/task-publish/index',
    'pages/consumer/task-history/index',
    'pages/consumer/task-detail/index',

    // 接任务端
    'pages/worker/task-list/index',
    'pages/worker/task-detail/index',

    // 管理员端
    'pages/admin/user-list/index',
    'pages/admin/order-list/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '任务平台',
    navigationBarTextStyle: 'black'
  }
});
