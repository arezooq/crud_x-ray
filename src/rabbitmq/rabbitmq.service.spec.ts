import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqplib';

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(true),
      publish: jest.fn().mockResolvedValue(true),
      consume: jest.fn().mockResolvedValue(true),
      ack: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    jest.spyOn(amqp, 'connect').mockResolvedValue(mockConnection as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMQService],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a message to RabbitMQ', async () => {
    const exchange = 'exchange_name';
    const routingKey = 'routing_key';
    const message = 'test message';
    
    await service.sendMessage(exchange, routingKey, message);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith('queue_name', { durable: true });
    expect(mockChannel.publish).toHaveBeenCalledWith(exchange, routingKey, Buffer.from(message));
  });

  it('should consume a message from RabbitMQ', async () => {
    const queue = 'testQueue';
    const message = 'test message';
    const callback = jest.fn();

    mockChannel.consume.mockImplementationOnce((queue, callback) => {
      callback({ content: Buffer.from(message) });
    });

    await service.consumeMessage(queue, callback);

    expect(callback).toHaveBeenCalledWith(message);
    expect(mockChannel.ack).toHaveBeenCalled();
  });
});
