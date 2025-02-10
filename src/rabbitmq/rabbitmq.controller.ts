import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import * as fs from 'fs';
import { RabbitMQService } from "./rabbitmq.service";
import { DataService } from "src/data/data.service";

@Controller('rabbitmq')
export class RabbitMQController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly dataService: DataService,
    ) {}

    // read data from file x-ray.json
    private readDataFile = () => {
        try {
            const data = fs.readFileSync('x-ray.json', 'utf-8');
            const parsedData = JSON.parse(data);
            return parsedData.data;
        } catch (error) {
            console.error('Error reading data from file:', error);
            throw error;
        }
    }

    // load data & send to RabbitMQ
    @Post('load-file')
    async loadDataFromFile() {
        const data = this.readDataFile();
        const exchange = 'exchange_name';
        const routingKey = 'routing_key';

        await this.rabbitMQService.sendMessage(exchange, routingKey, JSON.stringify(data));

        return { status: 'Data loaded from file and sent to RabbitMQ' };
    }

    //  send message to RabbitMQ
    @Post('send')
    async sendMessage(@Body('queue') queue: string, @Body('message') message: string) {
        try {
            const exchange = 'exchange_name';
            const routingKey = 'routing_key';
            await this.rabbitMQService.sendMessage(exchange, routingKey, message);
            return { status: 'Message sent' };
        } catch (error) {
            console.error('Error sending message:', error);
            return { status: 'Failed to send message' };
        }
    }

    //  receive message of RabbitMQ
    @Get('receive')
    async receiveMessage(@Query('queue') queue: string) {
        let receiveMessage: string | undefined;
        await this.rabbitMQService.consumeMessage(queue, (msg) => {
            receiveMessage = msg;
            if (msg) {
                this.dataService.createMany(JSON.parse(msg));  // ذخیره‌سازی داده‌ها
            }
        });
        return { message: receiveMessage || 'No message received yet' };
    }
}
