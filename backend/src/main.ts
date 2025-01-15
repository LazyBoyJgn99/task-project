import { WinstonModule } from 'nest-winston';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormatInterceptor } from '@/interceptor/response.format';
import { ResponseLoggingInterceptor } from '@/interceptor/response.logging';
import { ResponseUndefinedInterceptor } from '@/interceptor/response.undefined';
import { createSwaggerDocument } from '@/config/swagger';
import { ResponseExceptionFilter } from '@/filter/response.exception';
import { LogStoreInstance } from '@/utils/log.store';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: LogStoreInstance,
    }),
  });
  const httpAdapter = app.get(HttpAdapterHost);
  // 适配器：websocket
  app.useWebSocketAdapter(new WsAdapter(app));
  // 过滤器：返回异常格式化
  app.useGlobalFilters(new ResponseExceptionFilter(httpAdapter));
  // 拦截器：返回请求格式化
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  // 拦截器：修改相应体中的undefined为null
  app.useGlobalInterceptors(new ResponseUndefinedInterceptor());
  // 拦截器：打印接口调用日志
  app.useGlobalInterceptors(new ResponseLoggingInterceptor());
  // 管道：入参验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 启用类型转换
    }),
  );
  // swagger文档
  createSwaggerDocument(app);
  // 跨域
  app.enableCors({
    origin: '*',
    allowedHeaders: ['Authorization', 'content-type'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(3100);
}
bootstrap();
