/* eslint-disable prettier/prettier */
import {
  IsString,
  IsInt,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClinicalDocumentDto {
  @ApiProperty({
    description: ' the ID of patient associated with this clinical document.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    description: ' the ID of appointment related to this clinical document.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  appointment_id: number;

  @ApiProperty({
    description: 'Type of clinical document',
    example: 'Discharge Summary', //or such as "Discharge Summary", "Progress Note", or "Lab Report".
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  document_type: string;

  @ApiProperty({
    description:
      'Version or identifier of the consent form associated with this document',
    example: 'Consent Form v2.1',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  consent_version: string;

  @ApiPropertyOptional({
    description:
      'File path or URL to the stored clinical document, if available.',
    example: '/documents/clinical/12345.pdf',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  file_path?: string;
}
