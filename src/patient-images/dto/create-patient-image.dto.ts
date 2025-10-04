import { IsString, IsNumber, IsOptional, Length } from 'class-validator';

export class CreatePatientImageDto {
    @IsNumber()
    patient_id: number;

    @IsString()
    @Length(2, 50)
    image_type: string;

    @IsString()
    file_path: string;

    @IsNumber()
    uploaded_by_staff_id: number;

    @IsOptional()
    @IsString()
    notes?: string;
}
