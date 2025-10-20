import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointments.dto';
import { AppointmentStatus } from 'src/common/enums/status.enums';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { patient_id, doctor_id, appointment_time, status } =
      createAppointmentDto;

    const appointment = this.appointmentRepository.create({
      patient_id,
      doctor_id,
      appointment_time: new Date(appointment_time),
      status: status ?? AppointmentStatus.SCHEDULED,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(
    offset: number = 0,
    limit: number = 10,
  ): Promise<{ data: Appointment[]; count: number }> {
    const [data, count] = await this.appointmentRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, count };
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    const { status } = updateAppointmentDto;

    if (status !== undefined) {
      if (!Object.values(AppointmentStatus).includes(status)) {
        throw new ConflictException('Invalid appointment status value');
      }
      appointment.status = status;
    }

    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<{ message: string }> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
    return { message: 'Appointment deleted successfully' };
  }

  async findByPatientAndDoctor(
    patientId?: number,
    doctorId?: number,
  ): Promise<Appointment[]> {
    const qb = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor');

    if (patientId) {
      qb.andWhere('patient.patient_id = :patientId', { patientId });
    }

    if (doctorId) {
      qb.andWhere('doctor.doctor_id = :doctorId', { doctorId });
    }

    qb.orderBy('appointment.appointment_time', 'DESC');

    return qb.getMany();
  }
}
