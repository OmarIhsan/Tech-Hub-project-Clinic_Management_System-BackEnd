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
import { ProceduresService } from './procedures.service';
import { CreateProceduresDto } from './dto/create-procedures.dto';
import { UpdateProceduresDto } from './dto/update-procedures.dto';
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
import { Procedures } from './entities/procedures.entity';

@ApiTags('procedures')
@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Create a new medical procedure record',
    description:
      'Registers a new medical procedure in the clinic management system.',
  })
  @ApiBody({ type: CreateProceduresDto })
  @ApiResponse({
    status: 201,
    description: 'Procedure successfully created.',
    type: Procedures,
  })
  @ApiResponse({
    status: 409,
    description: 'Procedure record already exists.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createProceduresDto: CreateProceduresDto) {
    return this.proceduresService.create(createProceduresDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({
    summary: 'Get all procedures',
    description: 'Retrieves a paginated list of medical procedure records.',
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
    description: 'Procedures retrieved successfully.',
    type: [Procedures],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async findAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.proceduresService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({
    summary: 'Get procedure by ID',
    description:
      'Retrieves a single medical procedure record by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Procedure unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Procedure found successfully.',
    type: Procedures,
  })
  @ApiResponse({
    status: 404,
    description: 'Procedure not found.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proceduresService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({
    summary: 'Update procedure record',
    description: 'Modifies details of an existing medical procedure.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Procedure unique identifier',
  })
  @ApiBody({ type: UpdateProceduresDto })
  @ApiResponse({
    status: 200,
    description: 'Procedure updated successfully.',
    type: Procedures,
  })
  @ApiResponse({ status: 404, description: 'Procedure not found.' })
  @ApiResponse({ status: 409, description: 'Procedure record already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProceduresDto: UpdateProceduresDto,
  ) {
    return this.proceduresService.update(id, updateProceduresDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete procedure record',
    description:
      'Permanently deletes a medical procedure record from the system.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Procedure unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Procedure deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Procedure deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Procedure not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.proceduresService.remove(id);
  }
}
