import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctors } from './entities/doctors.entity';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctors]), StaffModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
