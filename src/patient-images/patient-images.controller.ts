import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PatientImagesService } from './patient-images.service';
import { PatientImage } from './entities/patient-image.entity';
import { CreatePatientImageDto } from './dto/create-patient-image.dto';
import { UpdatePatientImageDto } from './dto/update-patient-image.dto';

@Controller('patient-images')
export class PatientImagesController {
    constructor(private readonly patientImagesService: PatientImagesService) { }

    @Get()
    getAll(): Promise<PatientImage[]> {
        return this.patientImagesService.findAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number): Promise<PatientImage> {
        return this.patientImagesService.findOne(id);
    }

    @Post()
    create(@Body() createPatientImageDto: CreatePatientImageDto): Promise<PatientImage> {
        return this.patientImagesService.create(createPatientImageDto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientImageDto: UpdatePatientImageDto): Promise<PatientImage> {
        return this.patientImagesService.update(id, updatePatientImageDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.patientImagesService.remove(id);
    }
}
