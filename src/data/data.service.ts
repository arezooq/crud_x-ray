import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { DataEntity } from './entities/data.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(DataEntity)
    private dataRepository: Repository<DataEntity>,
  ) {}

  // get all data
  async getAll(): Promise<DataEntity[]> {
    return await this.dataRepository.find();
  }

  // get one data by id
  async getOne(id: string): Promise<DataEntity> {
    const data = await this.dataRepository.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('Data Not found');
    }
    return data;
  }

  // insert many data
  async createMany(dataArray: any[]): Promise<DataEntity[]> {
    const signals: DeepPartial<DataEntity>[] = dataArray.map(item => {
      const signal = new DataEntity();
      signal.id = uuidv4();
      signal.time = new Date();
      signal.deviceId = item[0];
      signal.xCoordination = item[1][0];
      signal.yCoordination = item[1][1];
      signal.speed = item[1][2];
  
      return signal;
    });
  
    return await this.dataRepository.save(signals);
  }

  // update data by id
  async update(id: string, data: DataEntity): Promise<DataEntity> {
    await this.getOne(id);
    await this.dataRepository.update(id, data);
    return this.getOne(id);
  }

  // remove data by id
  async remove(id: string): Promise<void> {
    await this.getOne(id); //
    await this.dataRepository.delete(id);
  }

  // filter data by time or deviceId
  async filterByCriteria(time?: string, device?: string): Promise<DataEntity[]> {
    const queryBuilder = this.dataRepository.createQueryBuilder('data');

    if (time) {
      queryBuilder.andWhere('data.time = :time', { time });
    }

    if (device) {
      queryBuilder.andWhere('data.device = :device', { device });
    }

    return await queryBuilder.getMany();
  }
}
