import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import configuration from 'config/configuration';

const { appId, secret } = configuration.wechat;

@Injectable()
export class WechatClient {
  constructor(private readonly httpService: HttpService) {}

  async GetAccessToken(): Promise<string> {
    const grantType = 'client_credential';
    const url = `https://api.weixin.qq.com/cgi-bin/token?appid=${appId}&secret=${secret}&grant_type=${grantType}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    if (!data || data.errmsg) {
      throw new InternalServerErrorException(data.errmsg);
    }
    return data.access_token;
  }

  async GetUserOpenIdByCode(code: string): Promise<string> {
    const grantType = 'authorization_code';
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=${grantType}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    if (!data || data.errmsg) {
      throw new InternalServerErrorException(data.errmsg);
    }
    return data.openid;
  }

  async GetUserPhoneByCode(code: string): Promise<string> {
    const accessToken = await this.GetAccessToken();
    const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
    const { data } = await firstValueFrom(
      this.httpService.post(url, {
        code,
      }),
    );
    if (!data || !data.phone_info) {
      throw new InternalServerErrorException(data.errmsg);
    }
    return data.phone_info.phoneNumber;
  }
}
