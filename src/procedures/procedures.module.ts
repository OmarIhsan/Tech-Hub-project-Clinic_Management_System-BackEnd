import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProceduresService } from './procedures.service';
import { ProceduresController } from './procedures.controller';
import { Procedures } from './entities/procedures.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Procedures])],
  controllers: [ProceduresController],
  providers: [ProceduresService],
  exports: [ProceduresService],
})
export class ProceduresModule {}
