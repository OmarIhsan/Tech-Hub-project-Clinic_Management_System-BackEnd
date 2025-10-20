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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PatientImagesService } from './patient-images.service';
import { PatientImage } from './entities/patient-image.entity';
import { CreatePatientImageDto } from './dto/create-patient-image.dto';
import { UpdatePatientImageDto } from './dto/update-patient-image.dto';
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
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { multerConfig } from './multer.config';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@ApiTags('patient-images')
@Controller('patient-images')
export class PatientImagesController {
  constructor(private readonly patientImagesService: PatientImagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ): Promise<PatientImage[]> {
    const offsetNum =
      offset && !isNaN(parseInt(offset, 10)) ? parseInt(offset, 10) : 0;
    const limitNum =
      limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    return this.patientImagesService.findAll(offsetNum, limitNum);
  }

  @Public()
  @Get('file/:filename')
  @ApiOperation({
    summary: 'Get patient image file (Public)',
    description:
      'Publicly accessible endpoint to retrieve patient image files.',
  })
  @ApiParam({
    name: 'filename',
    description: 'Image filename',
    example: 'patient-image-1760427321860-666227675.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Image file retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Image file not found.' })
  getImageFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'patient-images', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image file not found');
    }

    return res.sendFile(filePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
  @Roles(StaffRole.STAFF, StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
  @Roles(StaffRole.STAFF, StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a patient image file',
    description:
      'Upload a medical image file (X-ray, MRI, CT scan, etc.) for a patient. The file will be stored in uploads/patient-images folder.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
        patient_id: {
          type: 'number',
          description: 'ID of the patient',
          example: 1,
        },
        image_type: {
          type: 'string',
          description: 'Type of medical image (e.g., X-ray, MRI, CT scan)',
          example: 'X-ray',
        },
        uploaded_by_staff_id: {
          type: 'number',
          description: 'ID of the staff member uploading the image',
          example: 1,
        },
        notes: {
          type: 'string',
          description: 'Additional notes about the image',
          example: 'Chest X-ray showing normal lung fields',
        },
      },
      required: ['file', 'patient_id', 'image_type', 'uploaded_by_staff_id'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Patient image file uploaded successfully.',
    type: PatientImage,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or missing file.',
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('patient_id') patient_id: string,
    @Body('image_type') image_type: string,
    @Body('uploaded_by_staff_id') uploaded_by_staff_id: string,
    @Body('notes') notes?: string,
  ): Promise<PatientImage & { publicUrl: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const normalizedPath = file.path.replace(/\\/g, '/');

    const createPatientImageDto: CreatePatientImageDto = {
      patient_id: parseInt(patient_id, 10),
      image_type,
      file_path: normalizedPath,
      uploaded_by_staff_id: parseInt(uploaded_by_staff_id, 10),
      notes,
    };

    const result = await this.patientImagesService.create(
      createPatientImageDto,
    );

    const filename = file.filename;
    const publicUrl = `/patient-images/file/${filename}`;

    return {
      ...result,
      publicUrl,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload multiple patient image files',
    description:
      'Upload multiple medical image files (X-ray, MRI, CT scan, etc.) for a patient in a single request. Maximum 10 files per request.',
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
          description: 'Array of image files to upload (max 10)',
        },
        patient_id: {
          type: 'number',
          description: 'ID of the patient',
          example: 1,
        },
        image_type: {
          type: 'string',
          description: 'Type of medical image (e.g., X-ray, MRI, CT scan)',
          example: 'X-ray',
        },
        uploaded_by_staff_id: {
          type: 'number',
          description: 'ID of the staff member uploading the images',
          example: 1,
        },
        notes: {
          type: 'string',
          description: 'Additional notes about the images',
          example: 'Multiple chest X-ray views',
        },
      },
      required: ['files', 'patient_id', 'image_type', 'uploaded_by_staff_id'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Patient image files uploaded successfully.',
    schema: {
      type: 'object',
      properties: {
        uploadedCount: {
          type: 'number',
          example: 3,
        },
        images: {
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
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('patient_id') patient_id: string,
    @Body('image_type') image_type: string,
    @Body('uploaded_by_staff_id') uploaded_by_staff_id: string,
    @Body('notes') notes?: string,
  ): Promise<any> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedImages: any[] = [];

    for (const file of files) {
      const normalizedPath = file.path.replace(/\\/g, '/');

      const createPatientImageDto: CreatePatientImageDto = {
        patient_id: parseInt(patient_id, 10),
        image_type,
        file_path: normalizedPath,
        uploaded_by_staff_id: parseInt(uploaded_by_staff_id, 10),
        notes,
      };

      const result = await this.patientImagesService.create(
        createPatientImageDto,
      );

      const filename = file.filename;
      const publicUrl = `/patient-images/file/${filename}`;

      uploadedImages.push({
        ...result,
        publicUrl,
      });
    }

    return {
      uploadedCount: uploadedImages.length,
      images: uploadedImages,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.DOCTOR, StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
  @Roles(StaffRole.OWNER)
  @ApiBearerAuth('JWT-auth')
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
