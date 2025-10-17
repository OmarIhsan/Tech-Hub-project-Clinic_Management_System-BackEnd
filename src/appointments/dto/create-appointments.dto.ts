import { IsDateString, IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../common/enums/status.enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: ' the ID of  patient scheduled for the appointment.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  patient_id: number;

  @ApiProperty({
    description: 'the ID of doctor assigned to the appointment.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty({
    description:
      'Scheduled date and time of the appointment in ISO 8601 format.',
    example: '2025-10-10T16:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  appointment_time: string;

  @ApiPropertyOptional({
    description: 'Current status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
