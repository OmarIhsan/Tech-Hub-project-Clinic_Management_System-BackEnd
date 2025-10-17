import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherIncomesService } from './other-incomes.service';
import { OtherIncomesController } from './other-incomes.controller';
import { OtherIncome } from './entities/other-income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtherIncome])],
  controllers: [OtherIncomesController],
  providers: [OtherIncomesService],
})
export class OtherIncomesModule {}
