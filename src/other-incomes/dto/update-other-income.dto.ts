/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateOtherIncomeDto } from './create-other-income.dto';

export class UpdateOtherIncomeDto extends PartialType(CreateOtherIncomeDto) {}
