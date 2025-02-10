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
      publish: jest.fn().mockResolvedValue(true),  // Changed to 'publish' instead of 'sendToQueue'
      consume: jest.fn().mockResolvedValue(true),
      ack: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    // Mocking amqp.connect to return mockConnection
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
    expect(mockChannel.publish).toHaveBeenCalledWith(exchange, routingKey, Buffer.from(message));  // Adjusted to 'publish'
  });

  it('should consume a message from RabbitMQ', async () => {
    const queue = 'testQueue';
    const message = 'test message';
    const callback = jest.fn();

    // Mocking the consume method to simulate a message being received
    mockChannel.consume.mockImplementationOnce((queue, callback) => {
      callback({ content: Buffer.from(message) });
    });

    await service.consumeMessage(queue, callback);

    // Checking if the callback was called with the correct message
    expect(callback).toHaveBeenCalledWith(message);
    expect(mockChannel.ack).toHaveBeenCalled();
  });
});
