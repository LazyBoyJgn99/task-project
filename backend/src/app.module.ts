import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ApiModule } from './api/application/application.module';
import { AuthGuard } from './guard/auth.guard';
import configuration from 'config/configuration';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    TypeOrmModule.forRoot(configuration.mysql as TypeOrmModuleOptions),
    ScheduleModule.forRoot(),
    ApiModule,
  ],
})
export class AppModule {}
