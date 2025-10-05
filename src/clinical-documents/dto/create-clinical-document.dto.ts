import { IsString, IsNumber, Length } from 'class-validator';

export class CreateClinicalDocumentDto {
    @IsNumber()
    patient_id: number;

    @IsNumber()
    appointment_id: number;

    @IsString()
    @Length(2, 50)
    document_type: string;

    @IsString()
    @Length(2, 50)
    consent_version: string;

    @IsString()
    file_path: string;
}
