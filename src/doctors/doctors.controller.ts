/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorsDto } from './dto/create-doctors.dto';
import { UpdateDoctorsDto } from './dto/update-doctors.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorsDto: CreateDoctorsDto) {
    return this.doctorsService.create(createDoctorsDto);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.doctorsService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.doctorsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDoctorsDto: UpdateDoctorsDto,
  ) {
    return this.doctorsService.update(id, updateDoctorsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.doctorsService.remove(id);
  }
}
