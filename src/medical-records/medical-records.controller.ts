/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordsDto } from './dto/create-medical-records.dto';
import { UpdateMedicalRecordsDto } from './dto/update-medical-records.dto';
import { Roles } from 'src/Auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { StaffRole } from 'src/common/enums/status.enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MedicalRecords } from './entities/medical-records.entity';

@ApiTags('medical-records')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new medical record',
    description:
      'Records clinical findings, diagnosis, treatment, and relevant health data for a patient.',
  })
  @ApiBody({ type: CreateMedicalRecordsDto })
  @ApiResponse({
    status: 201,
    description: 'Medical record successfully created.',
    type: MedicalRecords,
  })
  @ApiResponse({
    status: 409,
    description:
      'Medical record conflict (e.g., duplicate record for same visit).',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async create(@Body() createMedicalRecordsDto: CreateMedicalRecordsDto) {
    return this.medicalRecordsService.create(createMedicalRecordsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all medical records',
    description:
      'Retrieves a paginated list of medical records for clinic patients.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Pagination offset (default: 0)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Pagination limit (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Medical records retrieved successfully.',
    type: [MedicalRecords],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async findAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    // Safely parse query parameters with defaults
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.medicalRecordsService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get medical record by ID',
    description:
      'Retrieves a single patient medical record using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medical record unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Medical record found successfully.',
    type: MedicalRecords,
  })
  @ApiResponse({ status: 404, description: 'Medical record not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicalRecordsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update medical record',
    description:
      'Updates clinical findings, diagnosis, or other record details for an existing patient record.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Medical record unique identifier',
  })
  @ApiBody({ type: UpdateMedicalRecordsDto })
  @ApiResponse({
    status: 200,
    description: 'Medical record updated successfully.',
    type: MedicalRecords,
  })
  @ApiResponse({ status: 404, description: 'Medical record not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict (e.g., duplicate diagnosis for same visit).',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicalRecordsDto: UpdateMedicalRecordsDto,
  ) {
    return this.medicalRecordsService.update(id, updateMedicalRecordsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete medical record',
    description:
      "Permanently deletes a patient's medical record from the clinic system.",
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Medical record unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Medical record deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Medical record deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Medical record not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicalRecordsService.remove(id);
  }
}
