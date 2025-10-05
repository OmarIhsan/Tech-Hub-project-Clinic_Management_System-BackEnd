/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateProceduresDto } from './create-procedures.dto';

export class UpdateProceduresDto extends PartialType(CreateProceduresDto) {}
