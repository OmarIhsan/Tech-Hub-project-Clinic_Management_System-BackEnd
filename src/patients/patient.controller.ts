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
import { PatientsService } from './patient.service';
import { Patient } from './entities/patient.entitiy';
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({
    summary: 'Get all patients',
    description: 'Retrieves a paginated list of patient records.',
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
    description: 'Patients retrieved successfully.',
    type: [Patient],
  })
  async getAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<Patient[]> {
    // Parse the query parameters safely, defaulting to 0 and 10
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.patientsService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Get patient by ID',
    description: 'Retrieves a single patient record by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Patient unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Patient found successfully.',
    type: Patient,
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Create a new patient record',
    description: 'Registers a new patient in the clinic system.',
  })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient successfully created.',
    type: Patient,
  })
  @ApiResponse({
    status: 409,
    description: 'A patient with the provided email already exists.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() data: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Update patient record',
    description: 'Updates existing patient details.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully.',
    type: Patient,
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiResponse({
    status: 409,
    description: 'A patient with the provided email already exists.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete patient record',
    description: 'Permanently removes a patient from the clinic records.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Patient deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Patient deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientsService.remove(id);
  }
}
