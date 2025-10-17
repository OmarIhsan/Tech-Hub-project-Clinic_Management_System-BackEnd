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
import { DoctorsService } from './doctors.service';
import { CreateDoctorsDto } from './dto/create-doctors.dto';
import { UpdateDoctorsDto } from './dto/update-doctors.dto';
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
import { Doctors } from './entities/doctors.entity';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Create a new doctor',
    description: 'Adds a new doctor to the clinic medical staff directory.',
  })
  @ApiBody({ type: CreateDoctorsDto })
  @ApiResponse({
    status: 201,
    description: 'Doctor successfully added.',
    type: Doctors,
  })
  @ApiResponse({
    status: 409,
    description: 'Doctor already exists.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async create(@Body() createDoctorsDto: CreateDoctorsDto) {
    return this.doctorsService.create(createDoctorsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({
    summary: 'Get all doctors',
    description: 'Retrieves a paginated list of clinic doctors.',
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
    description: 'Doctors retrieved successfully.',
    type: [Doctors],
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    // Safely parse query parameters with defaults
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.doctorsService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Get doctor by ID',
    description:
      "Retrieves a single doctor's profile using their unique identifier.",
  })
  @ApiParam({
    name: 'id',
    description: 'Doctor unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor found successfully.',
    type: Doctors,
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor not found.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Update doctor',
    description: 'Updates the information for a clinic doctor.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Doctor unique identifier',
  })
  @ApiBody({ type: UpdateDoctorsDto })
  @ApiResponse({
    status: 200,
    description: 'Doctor updated successfully.',
    type: Doctors,
  })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorsDto: UpdateDoctorsDto,
  ) {
    return this.doctorsService.update(id, updateDoctorsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete doctor',
    description: 'Permanently deletes a clinic doctor record.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Doctor unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Doctor deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
