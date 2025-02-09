import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');
  const options = new DocumentBuilder()
    .setTitle('X-Ray API')
    .setDescription('X-Ray API')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1', app, document);
  await app.listen(3000, () => console.log('Server is running on port 3000'));
}
bootstrap();
