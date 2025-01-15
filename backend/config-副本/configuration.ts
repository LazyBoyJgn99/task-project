const env = process.env.NODE_ENV;

const developmentEnv = {
  domain: 'https://www.gofarm.top',
  mysql: {
    type: 'mysql',
    host: '124.221.112.227',
    port: 3306,
    username: 'task',
    password: 'XnbhmjyCpxasnafR',
    database: 'task',
    synchronize: true,
    autoLoadEntities: true,
  },
  wechat: {
    appId: 'wx5db5b55eca56b771',
    secret: 'a4c170d8d6cc217686985febf07ffa78',
    mchId: '1685133806',
    apiV3Key: '12345678912345678912345678912345',
    serialNo: '77D8C2A4D2E61E8429534B451F947823AE837600',
  },
  jwt: {
    secret: 'secret-go-farm-pos-20240905',
    expiresIn: '7d',
  },
  tian: {
    apiKey: '75ddc0531e158ea7944fe7f3ae813e4f',
  },
};

export default env === 'development' ? developmentEnv : developmentEnv;
