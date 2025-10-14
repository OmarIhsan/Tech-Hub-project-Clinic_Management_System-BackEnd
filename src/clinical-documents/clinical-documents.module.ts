import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ClinicalDocumentsService } from './clinical-documents.service';
import { ClinicalDocumentsController } from './clinical-documents.controller';
import { ClinicalDocument } from './entities/clinical-document.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClinicalDocument]),
        MulterModule.register({
            dest: './uploads/clinical_documents',
        }),
    ],
    controllers: [ClinicalDocumentsController],
    providers: [ClinicalDocumentsService],
})
export class ClinicalDocumentsModule { }
