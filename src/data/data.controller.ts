import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DataService } from './data.service';
import { DataEntity } from './entities/data.entity';

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
  async createMany(@Body() dataArray: any[]) {
    return await this.dataService.createMany(dataArray);
  }

  // update data by id
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: DataEntity) {
    return await this.dataService.update(id, data);
  }

  // delete data by id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.dataService.remove(id);
  }

  // filter data by time or deviceId
  @Get('filter')
  async filter(@Query('time') time: string, @Query('device') device: string) {
    return await this.dataService.filterByCriteria(time, device);
  }
}
