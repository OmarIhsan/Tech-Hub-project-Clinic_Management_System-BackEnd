import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsDate,
} from 'class-validator';
import { StaffRole } from 'src/common/enums/status.enums';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Full legal name of the staff member.',
    example: 'Jon Smith',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({
    description: "Staff member's contact phone number in international format.",
    example: '+9647701234567',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^\+\d{10,15}$/, {
    message: 'Phone number must be in international format.',
  })
  phone: string;

  @ApiProperty({
    description: "Staff member's professional email address.",
    example: 'jon1.sm2@gmail.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'Date the staff member was hired, in ISO 8601 format.',
    example: '2022-09-04',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  hire_date: Date;

  @ApiPropertyOptional({
    description: 'Role of the staff member within the clinic.',
    enum: StaffRole,
    default: StaffRole.STAFF,
  })
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;

  @ApiProperty({
    description:
      'Password for the staff member account (minimum 6 characters).',
    example: 'securePassword123',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
