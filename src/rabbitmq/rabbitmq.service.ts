import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
    constructor(
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    ) {}

    async sendMessage(exchange: string, routingKey: string, message: string) {
        try {
            await this.client.emit(routingKey, message);
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
        }
    }

    async consumeMessage(queue: string, callback: (msg: string) => void) {
        this.client.connect().then(() => {
            this.client.send(queue, {}).subscribe((msg) => {
                callback(msg as string);
            });
        });
    }
}
