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
import { ProceduresService } from './procedures.service';
import { CreateProceduresDto } from './dto/create-procedures.dto';
import { UpdateProceduresDto } from './dto/update-procedures.dto';

@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post()
  async create(@Body() createProceduresDto: CreateProceduresDto) {
    return this.proceduresService.create(createProceduresDto);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.proceduresService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.proceduresService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProceduresDto: UpdateProceduresDto,
  ) {
    return this.proceduresService.update(id, updateProceduresDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.proceduresService.remove(id);
  }
}
