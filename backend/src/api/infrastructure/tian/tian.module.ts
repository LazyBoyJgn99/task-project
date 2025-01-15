import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TianClient } from './tian.client';

/**
 * 用到了tianapi，详细文档请参考:
 * https://www.tianapi.com/apiview/139
 */

@Module({
  imports: [HttpModule],
  providers: [TianClient],
  exports: [TianClient],
})
export class TianModule {}
