import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicalDocumentDto } from './create-clinical-document.dto';

export class UpdateClinicalDocumentDto extends PartialType(CreateClinicalDocumentDto) { }
