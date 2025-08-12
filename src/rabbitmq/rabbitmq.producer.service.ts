import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { rabbitMQConfig } from './rabbitmq.options';
import { RawIotMessage } from 'src/common/interfaces/iot-message.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async sendTestMessage(message: string) {
    await firstValueFrom(this.client.emit('test_message', { text: message }));
  }

  async sendMessage(pattern: 'iot-data', data: RawIotMessage): Promise<void> {
    await firstValueFrom(this.client.emit<RawIotMessage>(pattern, data));
  }
}
