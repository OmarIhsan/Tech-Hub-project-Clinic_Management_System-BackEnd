import { IsString, IsNumber, IsDateString, Length, Min } from 'class-validator';

export class CreateOtherIncomeDto {
    @IsString()
    @Length(2, 50)
    source: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number;

    @IsDateString()
    income_date: string;

    @IsNumber()
    staff_id: number;

    @IsNumber()
    patient_id: number;
}
