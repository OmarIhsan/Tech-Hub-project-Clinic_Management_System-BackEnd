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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointments.dto';
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
import { Appointment } from './entities/appointments.entity';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new appointment',
    description:
      'Creates a new medical appointment for a patient with a doctor.',
  })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Appointment successfully created.',
    type: Appointment,
  })
  @ApiResponse({
    status: 409,
    description: 'Appointment already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error.',
  })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all appointments',
    description: 'Retrieves a paginated list of medical appointments.',
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
    description: 'Appointments retrieved successfully.',
    type: [Appointment],
  })
  async findAll(
    @Query('offset', ParseIntPipe) offset: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.appointmentService.findAll(offset, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description:
      'Retrieves a single medical appointment by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment found successfully.',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update appointment',
    description: 'Updates existing medical appointment information.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Appointment unique identifier',
  })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully.',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  @ApiResponse({ status: 409, description: 'Appointment already exists.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.STAFF, StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete appointment',
    description: 'Permanently removes a medical appointment.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Appointment unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Appointment deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}
