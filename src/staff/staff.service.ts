import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DeepPartial } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Staff } from './entities/entity.staff';
import { Doctors } from '../doctors/entities/doctors.entity';
import * as bcrypt from 'bcrypt';
import { StaffRole } from 'src/common/enums/status.enums';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Doctors)
    private readonly doctorsRepo: Repository<Doctors>,
  ) {}

  findAll(offset?: number, limit?: number): Promise<Staff[]> {
    return this.staffRepo.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { staff_id: id } });
    if (!staff) throw new NotFoundException(`Staff #${id} not found`);
    return staff;
  }

  async create(data: Partial<Staff>, manager?: EntityManager): Promise<Staff> {
    const logger = new Logger('StaffService');
    logger.debug(
      `create called for email=${data.email} with manager=${!!manager}`,
    );
    if (data.hire_date && typeof data.hire_date === 'string') {
      data.hire_date = new Date(data.hire_date);
    }

    if (data.email && typeof data.email === 'string') {
      data.email = data.email.trim().toLowerCase();
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    if (!data.role) {
      data.role = StaffRole.STAFF;
    }

    const repo = manager ? manager.getRepository(Staff) : this.staffRepo;

    if (data.email) {
      const existing = await repo.findOne({ where: { email: data.email } });
      if (existing)
        throw new ConflictException('Staff with this email already exists');
    }

    const staffEntity = repo.create(data as DeepPartial<Staff>);
    try {
      const saved = await repo.save(staffEntity);
      logger.debug(`staff saved id=${saved.staff_id}`);
      return saved;
    } catch (err) {
      logger.error(
        'Failed to save staff',
        err instanceof Error ? err.stack : JSON.stringify(err),
      );
      throw err;
    }
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
    const updatedStaff = await this.staffRepo.save(staff);

    const doctor = await this.doctorsRepo.findOne({
      where: { staff_id: id },
    });

    if (doctor) {
      const doctorUpdateData: {
        full_name?: string;
        phone?: string;
        email?: string;
        hire_date?: Date;
      } = {};

      if (data.full_name !== undefined)
        doctorUpdateData.full_name = data.full_name;
      if (data.phone !== undefined) doctorUpdateData.phone = data.phone;
      if (data.email !== undefined) doctorUpdateData.email = data.email;
      if (data.hire_date !== undefined)
        doctorUpdateData.hire_date = data.hire_date;

      if (Object.keys(doctorUpdateData).length > 0) {
        Object.assign(doctor, doctorUpdateData);
        await this.doctorsRepo.save(doctor);
      }
    }

    return updatedStaff;
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
