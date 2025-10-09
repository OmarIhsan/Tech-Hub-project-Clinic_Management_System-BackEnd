/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from './entities/entity.staff';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  getAll(): Promise<Staff[]> {
    return this.staffService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Staff> {
    return this.staffService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateStaffDto): Promise<Staff> {
    return this.staffService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateStaffDto,
  ): Promise<Staff> {
    return this.staffService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.staffService.remove(id);
  }
}
