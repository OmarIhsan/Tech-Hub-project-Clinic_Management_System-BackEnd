import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ClinicalDocumentsService } from './clinical-documents.service';
import { ClinicalDocument } from './entities/clinical-document.entity';
import { CreateClinicalDocumentDto } from './dto/create-clinical-document.dto';
import { UpdateClinicalDocumentDto } from './dto/update-clinical-document.dto';

@Controller('clinical-documents')
export class ClinicalDocumentsController {
    constructor(private readonly clinicalDocumentsService: ClinicalDocumentsService) { }

    @Get()
    getAll(): Promise<ClinicalDocument[]> {
        return this.clinicalDocumentsService.findAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number): Promise<ClinicalDocument> {
        return this.clinicalDocumentsService.findOne(id);
    }

    @Post()
    create(@Body() createClinicalDocumentDto: CreateClinicalDocumentDto): Promise<ClinicalDocument> {
        return this.clinicalDocumentsService.create(createClinicalDocumentDto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateClinicalDocumentDto: UpdateClinicalDocumentDto): Promise<ClinicalDocument> {
        return this.clinicalDocumentsService.update(id, updateClinicalDocumentDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.clinicalDocumentsService.remove(id);
    }
}
