import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/status.enums';
import { Type } from 'class-transformer';

export class CreateDoctorsDto {
  @ApiProperty({
    description:
      'Full legal name of the doctor, including title if applicable.',
    example: 'Dr. John Doe',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({
    description: 'Gender of the doctor',
    example: 'Male',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Doctor's contact phone number in international format.",
    example: '+9647701234567',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^\+\d{10,15}$/, {
    message: 'Phone number must be in international format.',
  })
  phone: string;

  @ApiProperty({
    description: "Doctor's professional email address.",
    example: 'john.doe@clinic.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiPropertyOptional({
    description: 'Date the doctor was hired, in ISO 8601 format.',
    example: '2025-10-06',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  hire_date?: Date;
}
