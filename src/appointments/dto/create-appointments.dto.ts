/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  patient_id: number;

  @IsInt()
  doctor_id: number;

  @IsDateString()
  appointment_time: string;

  @IsString()
  status: string;
}
