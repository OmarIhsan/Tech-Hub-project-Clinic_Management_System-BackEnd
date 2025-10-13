/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClinicalDocumentsService } from './clinical-documents.service';
import { ClinicalDocument } from './entities/clinical-document.entity';
import { CreateClinicalDocumentDto } from './dto/create-clinical-document.dto';
import { UpdateClinicalDocumentDto } from './dto/update-clinical-document.dto';
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

@ApiTags('clinical-documents')
@Controller('clinical-documents')
export class ClinicalDocumentsController {
  constructor(
    private readonly clinicalDocumentsService: ClinicalDocumentsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all clinical documents',
    description:
      'Retrieves a paginated list of clinical documents for medical records.',
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
    description: 'Clinical documents retrieved successfully.',
    type: [ClinicalDocument],
  })
  async getAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<ClinicalDocument[]> {
    // Safely parse query parameters with defaults
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.clinicalDocumentsService.findAll(offsetNum, limitNum);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get clinical document by ID',
    description:
      'Retrieves a single clinical document using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Clinical document unique identifier',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Clinical document found successfully.',
    type: ClinicalDocument,
  })
  @ApiResponse({
    status: 404,
    description: 'Clinical document not found.',
  })
  getOne(@Param('id', ParseIntPipe) id: number): Promise<ClinicalDocument> {
    return this.clinicalDocumentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN, StaffRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new clinical document',
    description: 'Adds a new clinical document record to the medical database.',
  })
  @ApiBody({ type: CreateClinicalDocumentDto })
  @ApiResponse({
    status: 201,
    description: 'Clinical document successfully created.',
    type: ClinicalDocument,
  })
  @ApiResponse({
    status: 409,
    description: 'Clinical document already exists.',
  })
  create(
    @Body() createClinicalDocumentDto: CreateClinicalDocumentDto,
  ): Promise<ClinicalDocument> {
    return this.clinicalDocumentsService.create(createClinicalDocumentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update clinical document',
    description: 'Updates the information of an existing clinical document.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Clinical document unique identifier',
  })
  @ApiBody({ type: UpdateClinicalDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Clinical document updated successfully.',
    type: ClinicalDocument,
  })
  @ApiResponse({ status: 404, description: 'Clinical document not found.' })
  @ApiResponse({
    status: 409,
    description: 'Clinical document already exists.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClinicalDocumentDto: UpdateClinicalDocumentDto,
  ): Promise<ClinicalDocument> {
    return this.clinicalDocumentsService.update(id, updateClinicalDocumentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete clinical document',
    description: 'Permanently removes a clinical document from the system.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Clinical document unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Clinical document deleted successfully.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Clinical document deleted successfully.',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Clinical document not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clinicalDocumentsService.remove(id);
  }
}
