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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ClinicalDocumentsService } from './clinical-documents.service';
import { ClinicalDocument } from './entities/clinical-document.entity';
import { CreateClinicalDocumentDto } from './dto/create-clinical-document.dto';
import { UpdateClinicalDocumentDto } from './dto/update-clinical-document.dto';
import { Roles } from 'src/Auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/Auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { StaffRole } from 'src/common/enums/status.enums';
import { Public } from 'src/Auth/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { multerConfigClinicalDocuments } from './multer.config';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@ApiTags('clinical-documents')
@Controller('clinical-documents')
export class ClinicalDocumentsController {
  constructor(
    private readonly clinicalDocumentsService: ClinicalDocumentsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.clinicalDocumentsService.findAll(offsetNum, limitNum);
  }

  @Public()
  @Get('file/:filename')
  @ApiOperation({
    summary: 'Get clinical document file (Public)',
    description:
      'Publicly accessible endpoint to retrieve clinical document files.',
  })
  @ApiParam({
    name: 'filename',
    description: 'Document filename',
    example: 'clinical-doc-1760427321860-666227675.pdf',
  })
  @ApiResponse({
    status: 200,
    description: 'Document file retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Document file not found.' })
  getDocumentFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'uploads',
      'clinical_documents',
      filename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException('Document file not found');
    }

    return res.sendFile(filePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfigClinicalDocuments))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a clinical document file',
    description:
      'Upload a clinical document file (PDF, DOC, DOCX, images, etc.) for a patient. The file will be stored in uploads/clinical_documents folder.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file to upload',
        },
        patient_id: {
          type: 'number',
          description: 'ID of the patient',
          example: 1,
        },
        appointment_id: {
          type: 'number',
          description: 'ID of the appointment',
          example: 1,
        },
        document_type: {
          type: 'string',
          description: 'Type of clinical document',
          example: 'Discharge Summary',
        },
        consent_version: {
          type: 'string',
          description: 'Version of the consent form',
          example: 'Consent Form v2.1',
        },
        case_sheet: {
          type: 'string',
          description: 'Case sheet information',
          example: 'Case sheet details',
        },
      },
      required: [
        'file',
        'patient_id',
        'appointment_id',
        'document_type',
        'consent_version',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Clinical document file uploaded successfully.',
    type: ClinicalDocument,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or missing file.',
  })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('patient_id') patient_id: string,
    @Body('appointment_id') appointment_id: string,
    @Body('document_type') document_type: string,
    @Body('consent_version') consent_version: string,
    @Body('case_sheet') case_sheet?: string,
  ): Promise<ClinicalDocument & { publicUrl: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const normalizedPath = file.path.replace(/\\/g, '/');

    const createClinicalDocumentDto: CreateClinicalDocumentDto = {
      patient_id: parseInt(patient_id, 10),
      appointment_id: parseInt(appointment_id, 10),
      document_type,
      consent_version,
      file_path: normalizedPath,
      case_sheet,
    };

    const result = await this.clinicalDocumentsService.create(
      createClinicalDocumentDto,
    );

    const filename = file.filename;
    const publicUrl = `/api/v1/clinical-documents/file/${filename}`;

    return {
      ...result,
      publicUrl,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfigClinicalDocuments))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload multiple clinical document files',
    description:
      'Upload multiple clinical document files for a patient in a single request. Maximum 10 files per request.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of document files to upload (max 10)',
        },
        patient_id: {
          type: 'number',
          description: 'ID of the patient',
          example: 1,
        },
        appointment_id: {
          type: 'number',
          description: 'ID of the appointment',
          example: 1,
        },
        document_type: {
          type: 'string',
          description: 'Type of clinical document',
          example: 'Lab Report',
        },
        consent_version: {
          type: 'string',
          description: 'Version of the consent form',
          example: 'Consent Form v2.1',
        },
        case_sheet: {
          type: 'string',
          description: 'Case sheet information',
          example: 'Case sheet details',
        },
      },
      required: [
        'files',
        'patient_id',
        'appointment_id',
        'document_type',
        'consent_version',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Clinical document files uploaded successfully.',
    schema: {
      type: 'object',
      properties: {
        uploadedCount: {
          type: 'number',
          example: 3,
        },
        documents: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or no files uploaded.',
  })
  async uploadMultipleDocuments(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('patient_id') patient_id: string,
    @Body('appointment_id') appointment_id: string,
    @Body('document_type') document_type: string,
    @Body('consent_version') consent_version: string,
    @Body('case_sheet') case_sheet?: string,
  ): Promise<any> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedDocuments: any[] = [];

    for (const file of files) {
      const normalizedPath = file.path.replace(/\\/g, '/');

      const createClinicalDocumentDto: CreateClinicalDocumentDto = {
        patient_id: parseInt(patient_id, 10),
        appointment_id: parseInt(appointment_id, 10),
        document_type,
        consent_version,
        file_path: normalizedPath,
        case_sheet,
      };

      const result = await this.clinicalDocumentsService.create(
        createClinicalDocumentDto,
      );
      const filename = file.filename;
      const publicUrl = `/api/v1/clinical-documents/file/${filename}`;

      uploadedDocuments.push({
        ...result,
        publicUrl,
      });
    }

    return {
      uploadedCount: uploadedDocuments.length,
      documents: uploadedDocuments,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
