/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsInt, IsOptional, IsString,IsEnum } from 'class-validator';
import { TreatmentPlanStatus } from 'src/common/enums/status.enums';

export class CreateTreatmentPlansDto {
  @IsInt()
  patient_id: number;

  @IsInt()
  doctor_id: number;

  @IsInt()
  appointment_id: number;

  @IsString()
  diagnosis_summary: string;

  @IsOptional()
  prescription?: Buffer;

  @IsString()
  plan_details: string;

  @IsEnum(TreatmentPlanStatus)
  status: TreatmentPlanStatus;
}
