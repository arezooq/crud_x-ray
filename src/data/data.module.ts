import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IotData, IotDataSchema } from './entities/data.entity';
import { DataService } from './data.service';
import { DataController } from './data.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IotData.name, schema: IotDataSchema }]),
  ],
  providers: [DataService],
  controllers: [DataController],
  exports: [DataService],
})
export class DataModule {}
