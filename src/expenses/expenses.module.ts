/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { Staff } from 'src/staff/entities/entity.staff';

@Module({
  imports: [TypeOrmModule.forFeature([Expense,Staff])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
