/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateProceduresDto {
  @IsInt()
  patient_id: number;

  @IsInt()
  doctor_id: number;

  @IsInt()
  appointment_id: number;

  @IsInt()
  plan_id: number;

  @IsString()
  procedure_name: string;

  @IsString()
  procedure_notes: string;

  @IsDateString()
  performed_at: string;
}
