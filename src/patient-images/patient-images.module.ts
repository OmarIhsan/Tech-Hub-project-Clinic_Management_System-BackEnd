import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientImagesService } from './patient-images.service';
import { PatientImagesController } from './patient-images.controller';
import { PatientImage } from './entities/patient-image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PatientImage])],
    controllers: [PatientImagesController],
    providers: [PatientImagesService],
})
export class PatientImagesModule { }
