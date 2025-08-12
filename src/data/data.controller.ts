import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DataService } from './data.service';
import { IotData } from './entities/data.entity';

@Controller('signals')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  // get all data
  @Get()
  async getAll() {
    return await this.dataService.getAll();
  }

  // get one by id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.dataService.getOne(id);
  }

  // insert many data
  @Post('data')
  async save(@Body() data: Partial<IotData>) {
    return await this.dataService.save(data);
  }

  // update data by id
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<IotData>) {
    return await this.dataService.update(id, data);
  }

  // delete data by id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dataService.remove(id);
  }
}
