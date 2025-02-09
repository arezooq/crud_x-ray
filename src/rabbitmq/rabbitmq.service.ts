import { Injectable } from "@nestjs/common";
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    constructor() {
        this.init();
    }

    async init() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URI);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error('Error initializing RabbitMQ connection:', error);
            throw error;
        }
    }

    async sendMessage(queue: string, message: string) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
            this.channel.sendToQueue(queue, Buffer.from(message));
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
        }
    }

    async consumeMessage(queue: string, callback: (msg: string) => void) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
            this.channel.consume(queue, (msg) => {
                if (msg) {
                    callback(msg.content.toString());
                    this.channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Error consuming message from RabbitMQ:', error);
        }
    }
}
