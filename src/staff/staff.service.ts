import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/entity.staff';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  findAll(): Promise<Staff[]> {
    return this.staffRepo.find();
  }

  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { staff_id: id } });
    if (!staff) throw new NotFoundException(`Staff #${id} not found`);
    return staff;
  }

  create(data: Partial<Staff>): Promise<Staff> {
  if (data.hire_date && typeof data.hire_date === 'string') {
    data.hire_date = new Date(data.hire_date);
  }
  const staff = this.staffRepo.create(data);
  return this.staffRepo.save(staff);
}

  async update(id: number, data: Partial<Staff>): Promise<Staff> {
  const staff = await this.findOne(id);

  if (data.hire_date && typeof data.hire_date === 'string') {
    data.hire_date = new Date(data.hire_date);
  }

  Object.assign(staff, data);
  return this.staffRepo.save(staff);
}

  async remove(id: number): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepo.remove(staff);
  }
}
