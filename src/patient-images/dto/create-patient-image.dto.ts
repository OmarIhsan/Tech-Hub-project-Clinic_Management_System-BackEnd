import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  Length,
} from 'class-validator';

export class CreatePatientImageDto {
  @ApiProperty({
    description: 'ID of the patient associated with this image.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    description: 'Type of medical image',
    example: 'CT scan',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  image_type: string;

  @ApiPropertyOptional({
    description:
      'File path or URL to the stored medical image. (Auto-generated when uploading file)',
    example: '/images/patient/ctscan_12345.png',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_path?: string;

  @ApiProperty({
    description: 'ID of the staff member who uploaded the image.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  uploaded_by_staff_id: number;

  @ApiPropertyOptional({
    description:
      'Additional clinical notes or observations related to the image.',
    example: 'Benign lesion observed in left lung field.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  notes?: string;
}
