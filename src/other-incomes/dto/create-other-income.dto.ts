import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDateString,
  IsNotEmpty,
  Length,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateOtherIncomeDto {
  @ApiProperty({
    description: 'Source of the income',
    example: 'Event',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  source: string;

  @ApiProperty({
    description: 'Amount of the income in local currency (IQD).',
    example: 600000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Date the income was received, in ISO 8601 format.',
    example: '2025-06-08',
  })
  @IsDateString()
  @IsNotEmpty()
  income_date: string;

  @ApiPropertyOptional({
    description:
      'ID of the staff member associated with the income, if applicable.',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  staff_id?: number;

  @ApiPropertyOptional({
    description: 'ID of the patient associated with the income, if applicable.',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  patient_id?: number;
}
