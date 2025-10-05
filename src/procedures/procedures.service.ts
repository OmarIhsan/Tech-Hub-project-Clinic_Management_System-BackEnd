/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Procedures } from './entities/procedures.entity';
import { CreateProceduresDto } from './dto/create-procedures.dto';
import { UpdateProceduresDto } from './dto/update-procedures.dto';

@Injectable()
export class ProceduresService {
  constructor(
    @InjectRepository(Procedures)
    private readonly proceduresRepository: Repository<Procedures>,
  ) {}

  async create(createProceduresDto: CreateProceduresDto): Promise<Procedures> {
    const procedure = this.proceduresRepository.create(createProceduresDto);
    return this.proceduresRepository.save(procedure);
  }

  async findAll(
    offset = 0,
    limit = 10,
  ): Promise<{ data: Procedures[]; count: number }> {
    const [data, count] = await this.proceduresRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, count };
  }

  async findOne(id: number): Promise<Procedures> {
    const procedure = await this.proceduresRepository.findOne({
      where: { procedure_id: id },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    return procedure;
  }

  async update(
    id: number,
    updateProceduresDto: UpdateProceduresDto,
  ): Promise<Procedures> {
    const procedure = await this.findOne(id);

    Object.assign(procedure, updateProceduresDto);

    return this.proceduresRepository.save(procedure);
  }

  async remove(id: number): Promise<{ message: string }> {
    const procedure = await this.findOne(id);
    await this.proceduresRepository.remove(procedure);
    return { message: 'Procedure deleted successfully' };
  }
}
