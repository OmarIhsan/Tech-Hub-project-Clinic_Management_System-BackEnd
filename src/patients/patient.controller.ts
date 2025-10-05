import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PatientsService } from './patient.service';
import { Patient } from './entities/patient.entitiy';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Patient>): Promise<Patient> {
    return this.patientsService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Patient>): Promise<Patient> {
    return this.patientsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientsService.remove(id);
  }
}
