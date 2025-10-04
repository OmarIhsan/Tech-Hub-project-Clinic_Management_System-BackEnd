import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patient.service';
import { PatientsController } from './patient.controller';
import { Patient } from './entities/patient.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
