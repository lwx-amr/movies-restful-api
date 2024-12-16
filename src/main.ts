import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { winstonConfig } from './shared/logger/logger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

dotenv.config({ path: process.cwd() + '/.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.enableCors({});

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Movies Restful API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
