import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQController } from './rabbitmq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  controllers: [RabbitMQController],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
