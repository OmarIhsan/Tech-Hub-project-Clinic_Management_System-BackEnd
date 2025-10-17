import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointments.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
