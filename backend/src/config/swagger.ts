import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Go Farm农场POS系统')
  .setDescription('开始开发时间：2024.08.27')
  .setVersion('1.0')
  .build();

export const createSwaggerDocument = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
