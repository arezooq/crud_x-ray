import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQProducerService } from './rabbitmq/rabbitmq.producer.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rabbitMQProducerService: RabbitMQProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('send')
  async sendMessage() {
    await this.rabbitMQProducerService.sendTestMessage('Hello from NestJS!');
    return { status: 'Message sent' };
  }
}
