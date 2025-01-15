import * as fs from 'fs';
import configuration from 'config/configuration';

const config = {
  useFactory: async () => {
    return {
      appid: configuration.wechat.appId,
      mchid: configuration.wechat.mchId,
      publicKey: fs.readFileSync('config/apiclient_cert.pem'),
      privateKey: fs.readFileSync('config/apiclient_key.pem'),
      key: configuration.wechat.apiV3Key,
      serial_no: configuration.wechat.serialNo,
    };
  },
};

export default config;
