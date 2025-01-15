import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftPo } from './gift.po';
import { GiftAdapter } from './gift.adapter';
import { GiftDao } from './gift.dao';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([GiftPo]), forwardRef(() => UserModule)],
  providers: [GiftAdapter, GiftDao],
  exports: [GiftAdapter, GiftDao],
})
export class GiftModule {}
