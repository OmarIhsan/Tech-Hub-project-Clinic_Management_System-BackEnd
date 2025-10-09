/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsDateString, Length, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @Length(2, 50)
  category: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsDateString()
  expense_date: string;

  @IsString()
  reason: string;

  @IsNumber()
  staff_id: number;
}
