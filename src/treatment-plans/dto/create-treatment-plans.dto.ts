/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { TreatmentPlanStatus } from 'src/common/enums/status.enums';

export class CreateTreatmentPlansDto {
  @ApiProperty({
    description: 'ID of the patient for whom the treatment plan is created.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    description: 'ID of the doctor responsible for the treatment plan.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty({
    description: 'ID of the appointment associated with the treatment plan.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  appointment_id: number;

  @ApiProperty({
    description: "Summary of the patient's diagnosis",
    example: 'Acute viral fever',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  diagnosis_summary: string;

  @ApiPropertyOptional({
    description: 'Prescription details or file.',
    example: 'Paracetamol 500mg twice daily for 5 days', // (e.g., medication list, PDF, or image)
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prescription?: string;

  @ApiProperty({
    description: 'Detailed description of the treatment plan, .',
    example: 'Bed rest and medication as prescribed',
    //e.g., "Bed rest, hydration, and medication as prescribed"
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  plan_details: string;

  @ApiPropertyOptional({
    description: 'Current status of the treatment plan ',
    enum: TreatmentPlanStatus,
    default: TreatmentPlanStatus.ACTIVE,
  })
  @IsEnum(TreatmentPlanStatus)
  @IsOptional()
  status?: TreatmentPlanStatus;
}
