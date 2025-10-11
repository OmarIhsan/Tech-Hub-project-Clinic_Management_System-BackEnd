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
import { OtherIncomesService } from './other-incomes.service';
import { OtherIncome } from './entities/other-income.entity';
import { CreateOtherIncomeDto } from './dto/create-other-income.dto';
import { UpdateOtherIncomeDto } from './dto/update-other-income.dto';
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

@ApiTags('other-incomes')
@Controller('other-incomes')
export class OtherIncomesController {
  constructor(private readonly otherIncomesService: OtherIncomesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all other income records',
    description:
      'Retrieves a paginated list of non-operational income records for the clinic.',
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
    description: 'Other income records retrieved successfully.',
    type: [OtherIncome],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async getAll(
    @Query('offset', ParseIntPipe) offset: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<OtherIncome[]> {
    return this.otherIncomesService.findAll(offset, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get other income record by ID',
    description:
      'Retrieves a single other income record by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Other income record unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Other income record found successfully.',
    type: OtherIncome,
  })
  @ApiResponse({ status: 404, description: 'Other income record not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<OtherIncome> {
    return this.otherIncomesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new other income record',
    description:
      'Adds a new record for non-operational income sources like donations or events.',
  })
  @ApiBody({ type: CreateOtherIncomeDto })
  @ApiResponse({
    status: 201,
    description: 'Other income record successfully created.',
    type: OtherIncome,
  })
  @ApiResponse({
    status: 409,
    description: 'Other income record already exists.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async create(
    @Body() createOtherIncomeDto: CreateOtherIncomeDto,
  ): Promise<OtherIncome> {
    return this.otherIncomesService.create(createOtherIncomeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update other income record',
    description:
      'Updates information for an existing non-operational income record.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Other income unique identifier',
  })
  @ApiBody({ type: UpdateOtherIncomeDto })
  @ApiResponse({
    status: 200,
    description: 'Other income record updated successfully.',
    type: OtherIncome,
  })
  @ApiResponse({ status: 404, description: 'Other income record not found.' })
  @ApiResponse({
    status: 409,
    description: 'Other income record already exists.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOtherIncomeDto: UpdateOtherIncomeDto,
  ): Promise<OtherIncome> {
    return this.otherIncomesService.update(id, updateOtherIncomeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete other income record',
    description:
      'Permanently deletes a non-operational income record from the clinic system.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Other income unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Other income record deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Other income record deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Other income record not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.otherIncomesService.remove(id);
  }
}
