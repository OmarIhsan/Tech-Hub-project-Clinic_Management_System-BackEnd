import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Doctors } from './entities/doctors.entity';
import { Staff } from '../staff/entities/entity.staff';
import { CreateDoctorsDto } from './dto/create-doctors.dto';
import { UpdateDoctorsDto } from './dto/update-doctors.dto';
import { StaffService } from '../staff/staff.service';
import { StaffRole } from '../common/enums/status.enums';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctors)
    private readonly doctorsRepository: Repository<Doctors>,
    private readonly staffService: StaffService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createDoctorsDto: CreateDoctorsDto): Promise<Doctors> {
    const { full_name, gender, phone, email, hire_date } = createDoctorsDto;

    let hireDateValue: Date | undefined;
    if (hire_date) {
      if (typeof hire_date === 'string' || typeof hire_date === 'number') {
        hireDateValue = new Date(hire_date);
      } else if (hire_date instanceof Date) {
        hireDateValue = hire_date;
      }
    }

    if (gender === undefined || gender === null) {
      throw new BadRequestException(
        'gender is required for doctor registration',
      );
    }
    if (!email) {
      throw new BadRequestException(
        'email is required for doctor registration',
      );
    }
    if (!phone) {
      throw new BadRequestException(
        'phone is required for doctor registration',
      );
    }

    const defaultPassword = 'Doctor@123';
    return await this.dataSource.transaction(async (manager) => {
      try {
        const staff = await this.staffService.create(
          {
            email,
            full_name,
            phone,
            password: defaultPassword,
            role: StaffRole.DOCTOR,
            hire_date: hireDateValue,
          },
          manager,
        );

        if (!staff || !staff.staff_id) {
          Logger.error('Staff creation returned no id', JSON.stringify(staff));
          throw new Error('Failed to create staff for doctor registration');
        }

        const doctor = manager.create(Doctors, {
          full_name,
          gender,
          phone,
          email,
          hire_date: hireDateValue,
          staff,
        });

        const savedDoctor = await manager.save(doctor);

        try {
          const staffRepo = manager.getRepository(Staff);
          const staffEntity = await staffRepo.findOne({
            where: { staff_id: staff.staff_id },
          });
          if (!staffEntity) {
            throw new Error(
              `Staff with id=${staff.staff_id} not found for linking`,
            );
          }

          staffEntity.doctor_id = savedDoctor.doctor_id;

          await staffRepo.save(staffEntity);
          Logger.debug(
            `Linked staff_id=${staffEntity.staff_id} to doctor_id=${savedDoctor.doctor_id}`,
          );
        } catch (linkErr) {
          Logger.error(
            'Failed to link staff to doctor',
            linkErr instanceof Error ? linkErr.stack : JSON.stringify(linkErr),
          );
          throw linkErr;
        }

        Logger.debug(`doctor saved id=${savedDoctor.doctor_id}`);
        return savedDoctor;
      } catch (err) {
        Logger.error(
          'Error during doctor registration transaction',
          err instanceof Error ? err.stack : JSON.stringify(err),
        );
        throw err;
      }
    });
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

    if (hire_date !== undefined) {
      if (typeof hire_date === 'string' || typeof hire_date === 'number') {
        doctor.hire_date = new Date(hire_date);
      } else if (hire_date instanceof Date) {
        doctor.hire_date = hire_date;
      }
    }

    if (doctor.staff_id) {
      const staffUpdateData: {
        full_name?: string;
        phone?: string;
        email?: string;
        hire_date?: Date;
      } = {};
      if (full_name !== undefined) staffUpdateData.full_name = full_name;
      if (phone !== undefined) staffUpdateData.phone = phone;
      if (email !== undefined) staffUpdateData.email = email;
      if (hire_date !== undefined) staffUpdateData.hire_date = doctor.hire_date;

      if (Object.keys(staffUpdateData).length > 0) {
        await this.staffService.update(doctor.staff_id, staffUpdateData);
      }
    }

    return this.doctorsRepository.save(doctor);
  }

  async remove(id: number): Promise<{ message: string }> {
    const doctor = await this.findOne(id);
    await this.doctorsRepository.remove(doctor);
    return { message: 'Doctor deleted successfully' };
  }
}
