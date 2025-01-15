import { Module } from '@nestjs/common';
import { DomainModule } from '@/api/domain/domain.module';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { GiftAdapter } from './gift.adapter';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [GiftController],
  imports: [DomainModule, UserModule],
  providers: [GiftService, GiftAdapter],
  exports: [GiftAdapter],
})
export class GiftModule {}
