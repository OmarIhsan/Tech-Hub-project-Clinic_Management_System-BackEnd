import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalRecordsDto } from './create-medical-records.dto';

export class UpdateMedicalRecordsDto extends PartialType(
  CreateMedicalRecordsDto,
) {}
