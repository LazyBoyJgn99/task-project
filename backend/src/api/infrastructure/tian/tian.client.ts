import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import configuration from 'config/configuration';

const { apiKey } = configuration.tian;

export interface DateInfo {
  date: string;
  name: string;
  weekday: number;
}

@Injectable()
export class TianClient {
  constructor(private readonly httpService: HttpService) {}

  async DateInfo(date: string): Promise<DateInfo> {
    const url = `https://apis.tianapi.com/jiejiari/index?key=${apiKey}&date=${date}&type=0`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    if (!data || data.code !== HttpStatus.OK) {
      throw new InternalServerErrorException(data.msg);
    }
    return data.result.list[0];
  }
}
