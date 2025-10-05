/* eslint-disable prettier/prettier */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctors } from './entities/doctors.entity';
import { CreateDoctorsDto } from './dto/create-doctors.dto';
import { UpdateDoctorsDto } from './dto/update-doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctors)
    private readonly doctorsRepository: Repository<Doctors>,
  ) {}

  async create(createDoctorsDto: CreateDoctorsDto): Promise<Doctors> {
    const { full_name, gender, phone, email, hire_date } = createDoctorsDto;

    const doctor = this.doctorsRepository.create({
      full_name,
      gender,
      phone,
      email,
      hire_date: new Date(hire_date),
    });

    return this.doctorsRepository.save(doctor);
  }

  async findAll(
    offset = 0,
    limit = 10,
  ): Promise<{ data: Doctors[]; count: number }> {
    const [data, count] = await this.doctorsRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { hire_date: 'DESC' },
    });
    return { data, count };
  }

  async findOne(id: number): Promise<Doctors> {
    const doctor = await this.doctorsRepository.findOne({
      where: { doctor_id: id },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async update(
    id: number,
    updateDoctorsDto: UpdateDoctorsDto,
  ): Promise<Doctors> {
    const doctor = await this.findOne(id);
    const { full_name, gender, phone, email, hire_date } = updateDoctorsDto;

    if (full_name && full_name !== doctor.full_name) {
      const existing = await this.doctorsRepository.findOne({
        where: { full_name },
      });
      if (existing) {
        throw new ConflictException(
          'A doctor with this full name already exists',
        );
      }
      doctor.full_name = full_name;
    }

    if (gender !== undefined) doctor.gender = gender;
    if (phone !== undefined) doctor.phone = phone;
    if (email !== undefined) doctor.email = email;
    if (hire_date !== undefined) doctor.hire_date = new Date(hire_date);

    return this.doctorsRepository.save(doctor);
  }

  async remove(id: number): Promise<{ message: string }> {
    const doctor = await this.findOne(id);
    await this.doctorsRepository.remove(doctor);
    return { message: 'Doctor deleted successfully' };
  }
}
