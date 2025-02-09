import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/api/infrastructure/infrastructure.module';
import { UserDomainService } from './user/user.domain.service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    UserDomainService,
  ],
  exports: [
    UserDomainService,
  ],
})
export class DomainModule {}
