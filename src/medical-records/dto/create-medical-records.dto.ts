/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsInt, IsString, IsJSON, IsOptional, IsObject } from 'class-validator';

export class CreateMedicalRecordsDto {
  @IsInt()
  patient_id: number;

  @IsInt()
  doctor_id: number;

  @IsString()
  diagnosis: string;

  @IsString()
  clinical_findings: string;

  @IsString()
  treatment: string;

  @IsString()
  allergies: string;

  @IsString()
  medical_conditions: string;

  @IsOptional()
  @IsObject()
  current_meds_json?: object; 
}
