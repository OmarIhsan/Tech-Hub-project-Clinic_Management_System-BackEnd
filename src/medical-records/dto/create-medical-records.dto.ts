import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateMedicalRecordsDto {
  @ApiProperty({
    description: 'ID of the patient for whom the medical record is created.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    description: 'ID of the doctor responsible for this medical record.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty({
    description: 'Primary diagnosis for the patient ',
    example: 'Acute Gastroenteritis',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  diagnosis: string;

  @ApiProperty({
    description: 'Clinical findings observed during examination',
    example: 'Abdominal pain, vomiting, dehydration',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clinical_findings: string;

  @ApiProperty({
    description: 'Treatment plan or procedures administered',
    example: 'IV fluids, antiemetics, dietary modification',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  treatment: string;

  @ApiProperty({
    description: 'Known allergies of the patient, ',
    example: 'Penicillin, peanuts',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  allergies: string;

  @ApiPropertyOptional({
    description: 'Other relevant medical conditions',
    example: 'Hypertension, diabetes',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  medical_conditions?: string;

  @ApiPropertyOptional({
    description: 'Current medications',
    example: "Metformin, 'Lisinopril",
  })
  @IsOptional()
  @IsObject()
  current_meds_json?: object;
}
