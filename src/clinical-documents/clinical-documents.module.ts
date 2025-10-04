import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalDocumentsService } from './clinical-documents.service';
import { ClinicalDocumentsController } from './clinical-documents.controller';
import { ClinicalDocument } from './entities/clinical-document.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClinicalDocument])],
    controllers: [ClinicalDocumentsController],
    providers: [ClinicalDocumentsService],
})
export class ClinicalDocumentsModule { }
