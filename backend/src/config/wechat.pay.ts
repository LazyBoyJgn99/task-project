import { WeChatPayModuleOptions } from 'nest-wechatpay-node-v3';
import configuration from './configuration';

const { appId, mchId, serialNo, privateKey, apiV3Key } = configuration().wechat;
// TODO 需要配置公钥
export default {
  useFactory: (): WeChatPayModuleOptions => ({
    appid: appId,
    mchid: mchId,
    serial_no: serialNo,
    privateKey: Buffer.from(privateKey),
    publicKey: Buffer.from(privateKey),
  }),
};
