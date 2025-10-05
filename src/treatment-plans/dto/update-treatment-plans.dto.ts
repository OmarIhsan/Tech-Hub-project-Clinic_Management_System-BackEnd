/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentPlansDto } from './create-treatment-plans.dto';

export class UpdateTreatmentPlansDto extends PartialType(
  CreateTreatmentPlansDto,
) {}
