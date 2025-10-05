/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecords } from './entities/medical-records.entity';
import { CreateMedicalRecordsDto } from './dto/create-medical-records.dto';
import { UpdateMedicalRecordsDto } from './dto/update-medical-records.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecords)
    private readonly medicalRecordsRepository: Repository<MedicalRecords>,
  ) {}

  async create(
    createMedicalRecordsDto: CreateMedicalRecordsDto,
  ): Promise<MedicalRecords> {
    const medicalRecord = this.medicalRecordsRepository.create(
      createMedicalRecordsDto,
    );
    return this.medicalRecordsRepository.save(medicalRecord);
  }

  async findAll(
    offset = 0,
    limit = 10,
  ): Promise<{ data: MedicalRecords[]; count: number }> {
    const [data, count] = await this.medicalRecordsRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, count };
  }

  async findOne(id: number): Promise<MedicalRecords> {
    const medicalRecord = await this.medicalRecordsRepository.findOne({
      where: { record_id: id },
    });

    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }

    return medicalRecord;
  }

  async update(
    id: number,
    updateMedicalRecordsDto: UpdateMedicalRecordsDto,
  ): Promise<MedicalRecords> {
    const medicalRecord = await this.findOne(id);

    Object.assign(medicalRecord, updateMedicalRecordsDto);

    return this.medicalRecordsRepository.save(medicalRecord);
  }

  async remove(id: number): Promise<{ message: string }> {
    const medicalRecord = await this.findOne(id);
    await this.medicalRecordsRepository.remove(medicalRecord);
    return { message: 'Medical record deleted successfully' };
  }
}
