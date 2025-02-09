import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import * as fs from 'fs';
import { RabbitMQService } from "./rabbitmq.service";
import { DataService } from "../data/data.service";

@Controller('rabbitmq')
export class RabbitMQController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly dataService: DataService,
    ) {}

    // function read data from file x-ray.json
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

    // read data from file & send to RabbitMQ
    @Post('load-file')
    async loadDataFromFile() {
        const data = this.readDataFile();
        const queue = 'x-ray-queue';
        await this.rabbitMQService.sendMessage(queue, JSON.stringify(data));
        return { status: 'Data loaded from file and sent to RabbitMQ' };
    }

    // send message to RabbitMQ
    @Post('send')
    async sendMessage(@Body('queue') queue: string, @Body('message') message: string) {
        try {
            const parsedMessage = JSON.parse(message);
            await this.rabbitMQService.sendMessage(queue, JSON.stringify(parsedMessage));
            return { status: 'Message sent' };
        } catch (error) {
            console.error('Error sending message:', error);
            return { status: 'Failed to send message' };
        }
    }

    // receive message from RabbitMQ
    @Get('receive')
    async receiveMessage(@Query('queue') queue: string) {
        let receiveMessage: string | undefined;
        await this.rabbitMQService.consumeMessage(queue, (msg) => {
            receiveMessage = msg;
            this.dataService.createMany(JSON.parse(msg));
        });
        return { message: receiveMessage };
    }
}
