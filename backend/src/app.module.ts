import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './api/application/task/task.module';
import { UserModule } from './api/application/user/user.module';
import { AdminModule } from './api/application/admin/admin.module';
import { OrderModule } from './api/application/order/order.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('mysql'),
      }),
    }),
    AuthModule,
    UserModule,
    TaskModule,
    AdminModule,
    OrderModule,
  ],
})
export class AppModule {}
