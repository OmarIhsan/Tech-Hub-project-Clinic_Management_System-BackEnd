/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointments.dto';
// Extend partial but keep enum typing

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) { }
