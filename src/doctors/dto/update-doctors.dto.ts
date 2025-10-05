/* eslint-disable prettier/prettier */


import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorsDto } from './create-doctors.dto';

export class UpdateDoctorsDto extends PartialType(CreateDoctorsDto) {}
