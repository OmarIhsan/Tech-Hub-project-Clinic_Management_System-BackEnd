/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Gender } from 'src/common/enums/status.enums';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Full legal name of the patient.',
    example: 'Jane Smith',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({
    description: 'Gender of the patient.',
    example: 'Female',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Date of birth of the patient in ISO 8601 format.',
    example: '1998-06-08',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date_of_birth: Date;

  @ApiProperty({
    description: "Patient's contact phone number in international format.",
    example: '+9647701234567',
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @Matches(/^\+\d{10,15}$/, {
    message: 'Phone number must be in international format.',
  })
  phone: string;

  @ApiPropertyOptional({
    description: "Patient's email address.",
    example: 'jane.smith3@gmail.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    description: "Patient's residential address.",
    example: 'Iraq/Mosul',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;
}
