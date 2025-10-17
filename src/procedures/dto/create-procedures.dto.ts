import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsInt,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateProceduresDto {
  @ApiProperty({
    description: 'ID of the patient undergoing the procedure.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    description: 'ID of the doctor performing the procedure.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty({
    description: 'ID of the appointment associated with the procedure.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  appointment_id: number;

  @ApiProperty({
    description: 'ID of the treatment plan associated with the procedure.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  plan_id: number;

  @ApiProperty({
    description: 'Name of the medical procedure performed',
    example: 'Appendectomy',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  procedure_name: string;

  @ApiPropertyOptional({
    description: 'Additional notes or observations related to the procedure',
    example: 'Procedure completed successfully with no complications.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  procedure_notes?: string;

  @ApiProperty({
    description:
      'Date and time the procedure was performed, in ISO 8601 format.',
    example: '2025-10-10T09:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  performed_at: string;
}
