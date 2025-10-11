/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PatientImagesService } from './patient-images.service';
import { PatientImage } from './entities/patient-image.entity';
import { CreatePatientImageDto } from './dto/create-patient-image.dto';
import { UpdatePatientImageDto } from './dto/update-patient-image.dto';
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

@ApiTags('patient-images')
@Controller('patient-images')
export class PatientImagesController {
  constructor(private readonly patientImagesService: PatientImagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all patient images',
    description:
      'Retrieves a paginated list of patient medical images (e.g., X-rays, CT scans, MRIs).',
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
    description: 'Patient images retrieved successfully.',
    type: [PatientImage],
  })
  async getAll(
    @Query('offset', ParseIntPipe) offset: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<PatientImage[]> {
    return this.patientImagesService.findAll(offset, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get patient image by ID',
    description:
      'Retrieves a single patient image record by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Patient image unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Patient image found successfully.',
    type: PatientImage,
  })
  @ApiResponse({ status: 404, description: 'Patient image not found.' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<PatientImage> {
    return this.patientImagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new patient image record',
    description:
      'Adds a new medical image record for a patient (e.g., X-ray, MRI).',
  })
  @ApiBody({ type: CreatePatientImageDto })
  @ApiResponse({
    status: 201,
    description: 'Patient image record successfully created.',
    type: PatientImage,
  })
  @ApiResponse({
    status: 409,
    description: 'Patient image record already exists.',
  })
  async create(
    @Body() createPatientImageDto: CreatePatientImageDto,
  ): Promise<PatientImage> {
    return this.patientImagesService.create(createPatientImageDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update patient image record',
    description: 'Modifies details of an existing patient medical image.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Patient image unique identifier',
  })
  @ApiBody({ type: UpdatePatientImageDto })
  @ApiResponse({
    status: 200,
    description: 'Patient image record updated successfully.',
    type: PatientImage,
  })
  @ApiResponse({ status: 404, description: 'Patient image not found.' })
  @ApiResponse({
    status: 409,
    description: 'Patient image record already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientImageDto: UpdatePatientImageDto,
  ): Promise<PatientImage> {
    return this.patientImagesService.update(id, updatePatientImageDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete patient image record',
    description:
      'Permanent removal of a patient medical image from the system.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Patient image unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Patient image record deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Patient image record deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Patient image not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientImagesService.remove(id);
  }
}
