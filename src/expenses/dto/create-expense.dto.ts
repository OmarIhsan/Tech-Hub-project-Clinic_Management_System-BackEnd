import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  Length,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Category of the expense',
    example: 'Medical Supplies',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  category: string;

  @ApiProperty({
    description: 'Amount of the expense in local currency (IQD).',
    example: 2000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Date the expense was incurred, in ISO 8601 format.',
    example: '2025-10-09',
  })
  @IsDateString()
  @IsNotEmpty()
  expense_date: string;

  @ApiProperty({
    description: 'Reason for the expense',
    example: 'Staff Meals',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  reason: string;

  @ApiProperty({
    description: 'ID of the staff member responsible for the expense.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  staff_id: number;
}
