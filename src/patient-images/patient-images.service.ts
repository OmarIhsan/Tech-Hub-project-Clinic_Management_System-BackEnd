/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientImage } from './entities/patient-image.entity';
import { CreatePatientImageDto } from './dto/create-patient-image.dto';
import { UpdatePatientImageDto } from './dto/update-patient-image.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PatientImagesService {
  constructor(
    @InjectRepository(PatientImage)
    private readonly patientImageRepo: Repository<PatientImage>,
  ) { }

  findAll(offset?: number, limit?: number): Promise<PatientImage[]> {
    return this.patientImageRepo.find({
      relations: ['patient', 'uploadedByStaff'],
    });
  }

  async findOne(id: number): Promise<PatientImage> {
    const patientImage = await this.patientImageRepo.findOne({
      where: { image_id: id },
      relations: ['patient', 'uploadedByStaff'],
    });
    if (!patientImage)
      throw new NotFoundException(`Patient Image #${id} not found`);
    return patientImage;
  }

  create(createPatientImageDto: CreatePatientImageDto): Promise<PatientImage> {
    const patientImage = this.patientImageRepo.create(createPatientImageDto);
    return this.patientImageRepo.save(patientImage);
  }

  async update(
    id: number,
    updatePatientImageDto: UpdatePatientImageDto,
  ): Promise<PatientImage> {
    const patientImage = await this.findOne(id);
    Object.assign(patientImage, updatePatientImageDto);
    return this.patientImageRepo.save(patientImage);
  }

  async remove(id: number): Promise<void> {
    const patientImage = await this.findOne(id);

    // Delete the physical file if it exists
    if (patientImage.file_path) {
      const filePath = path.join(process.cwd(), patientImage.file_path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    }

    await this.patientImageRepo.remove(patientImage);
  }
}
