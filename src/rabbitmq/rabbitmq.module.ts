import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQController } from './rabbitmq.controller';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'queue_name',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    DataModule,
  ],
  providers: [RabbitMQService],
  controllers: [RabbitMQController],
})
export class RabbitMQModule {}
