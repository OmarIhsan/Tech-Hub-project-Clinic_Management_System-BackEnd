/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */





import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/entity.staff';
import * as bcrypt from 'bcrypt';
import { StaffRole } from 'src/common/enums/status.enums';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) { }

  findAll(offset?: number, limit?: number): Promise<Staff[]> {
    return this.staffRepo.find();
  }

  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { staff_id: id } });
    if (!staff) throw new NotFoundException(`Staff #${id} not found`);
    return staff;
  }

  async create(data: Partial<Staff>): Promise<Staff> {
    if (data.hire_date && typeof data.hire_date === 'string') {
      data.hire_date = new Date(data.hire_date);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    if (!data.role) {
      data.role = StaffRole.CUSTOMER;
    }

    if (data.email) {
      const existing = await this.staffRepo.findOne({
        where: { email: data.email },
      });
      if (existing)
        throw new ConflictException('Staff with this email already exists');
    }

    const staff = this.staffRepo.create(data);
    return this.staffRepo.save(staff);
  }

  async update(id: number, data: Partial<Staff>): Promise<Staff> {
    const staff = await this.findOne(id);

    if (data.hire_date && typeof data.hire_date === 'string') {
      data.hire_date = new Date(data.hire_date);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    if (data.role) {
      staff.role = data.role;
    }

    Object.assign(staff, data);
    return this.staffRepo.save(staff);
  }

  async remove(id: number): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepo.remove(staff);
  }

  async findById(staff_id: number): Promise<Staff | null> {
    return await this.staffRepo.findOne({ where: { staff_id } });
  }

  async findByEmail(email: string): Promise<Staff | null> {
    return await this.staffRepo.findOne({ where: { email } });
  }

  async updatePassword(staff_id: number, password: string): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { staff_id } });
    if (!staff) {
      throw new Error('User not found!');
    }
    staff.password = password;
    return this.staffRepo.save(staff);
  }
}
