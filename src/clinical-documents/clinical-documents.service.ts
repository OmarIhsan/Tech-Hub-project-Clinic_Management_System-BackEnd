import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalDocument } from './entities/clinical-document.entity';
import { CreateClinicalDocumentDto } from './dto/create-clinical-document.dto';
import { UpdateClinicalDocumentDto } from './dto/update-clinical-document.dto';

@Injectable()
export class ClinicalDocumentsService {
    constructor(
        @InjectRepository(ClinicalDocument)
        private readonly clinicalDocumentRepo: Repository<ClinicalDocument>,
    ) { }

    findAll(): Promise<ClinicalDocument[]> {
        return this.clinicalDocumentRepo.find({ relations: ['patient'] });
    }

    async findOne(id: number): Promise<ClinicalDocument> {
        const clinicalDocument = await this.clinicalDocumentRepo.findOne({
            where: { document_id: id },
            relations: ['patient']
        });
        if (!clinicalDocument) throw new NotFoundException(`Clinical Document #${id} not found`);
        return clinicalDocument;
    }

    create(createClinicalDocumentDto: CreateClinicalDocumentDto): Promise<ClinicalDocument> {
        const clinicalDocument = this.clinicalDocumentRepo.create(createClinicalDocumentDto);
        return this.clinicalDocumentRepo.save(clinicalDocument);
    }

    async update(id: number, updateClinicalDocumentDto: UpdateClinicalDocumentDto): Promise<ClinicalDocument> {
        const clinicalDocument = await this.findOne(id);
        Object.assign(clinicalDocument, updateClinicalDocumentDto);
        return this.clinicalDocumentRepo.save(clinicalDocument);
    }

    async remove(id: number): Promise<void> {
        const clinicalDocument = await this.findOne(id);
        await this.clinicalDocumentRepo.remove(clinicalDocument);
    }
}
