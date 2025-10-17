import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entitiy';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  findAll(offset?: number, limit?: number): Promise<Patient[]> {
    return this.patientRepo.find({
      skip: offset || 0,
      take: limit || 10,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { patient_id: id },
    });
    if (!patient) throw new NotFoundException(`Patient #${id} not found`);
    return patient;
  }

  create(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepo.create(data);
    return this.patientRepo.save(patient);
  }

  async update(id: number, data: Partial<Patient>): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, data);
    return this.patientRepo.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepo.remove(patient);
  }
}
