import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { RawIotMessage } from 'src/common/interfaces/iot-message.interface';

@Injectable()
export class RabbitMQConsumerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly dataService: DataService,
  ) {}

  @MessagePattern('iot-data')
  async handleIotData(rawData: RawIotMessage) {
    for (const deviceId in rawData) {
      const { data, time } = rawData[deviceId];

      const dataLength = data.length;

      const dataVolume = data.reduce((sum, [, values]) => {
        const speed =
          Array.isArray(values) && typeof values[2] === 'number'
            ? values[2]
            : 0;
        return sum + speed;
      }, 0);

      const dataPoints = data.map(([time, values]) => ({
        time,
        values,
      }));

      await this.dataService.save({
        deviceId,
        data: dataPoints,
        time,
        dataLength,
        dataVolume,
      });
    }
  }

  @MessagePattern('test_message')
  consumeMessage(@Payload() data: any) {
    console.log('Received message:', data);
  }
}
