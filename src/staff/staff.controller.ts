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
import { StaffService } from './staff.service';
import { Staff } from './entities/entity.staff';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
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

@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({
    summary: 'Get all staff members',
    description: 'Retrieves a paginated list of all staff members.',
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
    description: 'Staff retrieved successfully.',
    type: [Staff],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async getAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<Staff[]> {
    // Parse the query parameters safely, defaulting to 0 and 10
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.staffService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Get staff member by ID',
    description: 'Retrieves detailed information of a single staff member.',
  })
  @ApiParam({
    name: 'id',
    description: 'Staff unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Staff member found successfully.',
    type: Staff,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Staff> {
    return this.staffService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Create a new staff member',
    description: 'Adds a new staff member record to the clinic system.',
  })
  @ApiBody({ type: CreateStaffDto })
  @ApiResponse({
    status: 201,
    description: 'Staff member successfully created.',
    type: Staff,
  })
  @ApiResponse({
    status: 409,
    description: 'Staff member with this email already exists.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async create(@Body() data: CreateStaffDto): Promise<Staff> {
    return this.staffService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Update staff member',
    description: 'Updates details of an existing staff member.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Staff unique identifier' })
  @ApiBody({ type: UpdateStaffDto })
  @ApiResponse({
    status: 200,
    description: 'Staff member updated successfully.',
    type: Staff,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateStaffDto,
  ): Promise<Staff> {
    return this.staffService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete staff member',
    description: 'Removes a staff member from the system permanently.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Staff unique identifier' })
  @ApiResponse({
    status: 200,
    description: 'Staff member deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Staff member deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.staffService.remove(id);
  }
}
