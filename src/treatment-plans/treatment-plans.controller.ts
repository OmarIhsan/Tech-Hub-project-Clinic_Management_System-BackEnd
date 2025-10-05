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
  ParseIntPipe,
} from '@nestjs/common';
import { TreatmentPlansService } from './treatment-plans.service';
import { CreateTreatmentPlansDto } from './dto/create-treatment-plans.dto';
import { UpdateTreatmentPlansDto } from './dto/update-treatment-plans.dto';

@Controller('treatment-plans')
export class TreatmentPlansController {
  constructor(private readonly treatmentplansService: TreatmentPlansService) {}

  @Post()
  async create(@Body() createTreatmentplansDto: CreateTreatmentPlansDto) {
    return this.treatmentplansService.create(createTreatmentplansDto);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.treatmentplansService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.treatmentplansService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTreatmentplansDto: UpdateTreatmentPlansDto,
  ) {
    return this.treatmentplansService.update(id, updateTreatmentplansDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.treatmentplansService.remove(id);
  }
}
