import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IotData, IotDataDocument } from './entities/data.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(IotData.name) private iotDataModel: Model<IotDataDocument>,
  ) {}

  async getAll(): Promise<IotData[]> {
    return this.iotDataModel.find().exec();
  }

  async getOne(id: string): Promise<IotData> {
    const data = await this.iotDataModel.findById(id).exec();
    if (!data) throw new NotFoundException('Data not found');
    return data;
  }

  async save(data: Partial<IotData>): Promise<IotData> {
    const created = new this.iotDataModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<IotData>): Promise<IotData> {
    const updated = await this.iotDataModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Data not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.iotDataModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Data not found');
  }
}
