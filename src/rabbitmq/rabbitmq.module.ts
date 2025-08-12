import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMQConsumerService } from './rabbitmq.consumer.service';
import { DataModule } from 'src/data/data.module';
import { rabbitMQConfig } from './rabbitmq.options';
import { RabbitMQProducerService } from './rabbitmq.producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: rabbitMQConfig().transport,
        options: rabbitMQConfig().options,
      },
    ]),
    DataModule,
  ],
  providers: [RabbitMQConsumerService, RabbitMQProducerService],
  exports: [RabbitMQProducerService],
})
export class RabbitMQModule {}
