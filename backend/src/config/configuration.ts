export default () => ({
  mysql: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'task_platform',
    autoLoadEntities: true,
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '7d',
  },
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    serialNo: process.env.WECHAT_SERIAL_NO || '',
    privateKey: process.env.WECHAT_PRIVATE_KEY || '',
    publicKey: process.env.WECHAT_PUBLIC_KEY || '',
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
    notifyUrl: process.env.WECHAT_NOTIFY_URL || 'http://localhost:3000/api/wxpay/notify',
    refundNotifyUrl: process.env.WECHAT_REFUND_NOTIFY_URL || 'http://localhost:3000/api/wxpay/refund/notify',
  }
}); 