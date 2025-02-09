import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/db.config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), RabbitMQModule, DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

