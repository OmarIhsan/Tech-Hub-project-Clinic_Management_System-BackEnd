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
import { TreatmentPlansService } from './treatment-plans.service';
import { CreateTreatmentPlansDto } from './dto/create-treatment-plans.dto';
import { UpdateTreatmentPlansDto } from './dto/update-treatment-plans.dto';
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
import { TreatmentPlans } from './entities/treatment-plans.entity';

@ApiTags('treatment-plans')
@Controller('treatment-plans')
export class TreatmentPlansController {
  constructor(private readonly treatmentplansService: TreatmentPlansService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Create a new treatment plan',
    description: 'Creates a new treatment plan for a patient.',
  })
  @ApiBody({ type: CreateTreatmentPlansDto })
  @ApiResponse({
    status: 201,
    description: 'Treatment plan successfully created.',
    type: TreatmentPlans,
  })
  @ApiResponse({
    status: 409,
    description: 'Treatment plan already exists.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createTreatmentplansDto: CreateTreatmentPlansDto) {
    return this.treatmentplansService.create(createTreatmentplansDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({
    summary: 'Get all treatment plans',
    description: 'Retrieves a paginated list of treatment plans.',
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
    description: 'Treatment plans retrieved successfully.',
    type: [TreatmentPlans],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async findAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    // Safely parse query parameters, defaulting to 0 and 10
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.treatmentplansService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Get treatment plan by ID',
    description: 'Retrieves a single treatment plan by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Treatment plan unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Treatment plan found successfully.',
    type: TreatmentPlans,
  })
  @ApiResponse({
    status: 404,
    description: 'Treatment plan not found.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.treatmentplansService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Update treatment plan',
    description: 'Updates existing treatment plan information.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Treatment plan unique identifier',
  })
  @ApiBody({ type: UpdateTreatmentPlansDto })
  @ApiResponse({
    status: 200,
    description: 'Treatment plan updated successfully.',
    type: TreatmentPlans,
  })
  @ApiResponse({ status: 404, description: 'Treatment plan not found.' })
  @ApiResponse({ status: 409, description: 'Treatment plan already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTreatmentplansDto: UpdateTreatmentPlansDto,
  ) {
    return this.treatmentplansService.update(id, updateTreatmentplansDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete treatment plan',
    description: 'Permanently removes a treatment plan from the system.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Treatment plan unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Treatment plan deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Treatment plan deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Treatment plan not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.treatmentplansService.remove(id);
  }
}
