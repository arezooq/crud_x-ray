import { DataService } from '../data/data.service';
import { RabbitMQConsumerService } from './rabbitmq.consumer.service';
import { Test } from '@nestjs/testing';
import { RawIotMessage } from '../common/interfaces/iot-message.interface';

describe('handleIotData', () => {
  let service: RabbitMQConsumerService;
  let dataService: DataService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RabbitMQConsumerService,
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: DataService,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<RabbitMQConsumerService>(RabbitMQConsumerService);
    dataService = moduleRef.get<DataService>(DataService);
  });

  it('should process rawData and call dataService.save with processed data', async () => {
    const rawData: RawIotMessage = {
      device1: {
        data: [
          [123, [51.5, 12.4, 2.3]],
          [124, [51.6, 12.5, 2.5]],
        ],
        time: 999999,
      },
    };

    await service.handleIotData(rawData);

    expect(dataService.save).toHaveBeenCalledTimes(1);
    expect(dataService.save).toHaveBeenCalledWith({
      deviceId: 'device1',
      time: 999999,
      dataLength: 2,
      dataVolume: 4.8,
      data: [
        { time: 123, values: [51.5, 12.4, 2.3] },
        { time: 124, values: [51.6, 12.5, 2.5] },
      ],
    });
  });
});
