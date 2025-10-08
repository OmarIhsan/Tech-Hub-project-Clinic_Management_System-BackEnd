/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsDateString, IsInt, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../common/enums/status.enums';

export class CreateAppointmentDto {
  @IsInt()
  patient_id: number;

  @IsInt()
  doctor_id: number;

  @IsDateString()
  appointment_time: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
