/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Staff } from 'src/staff/entities/entity.staff';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  findAll(offset: number, limit: number): Promise<Expense[]> {
    return this.expenseRepo.find({ relations: ['staff'] });
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepo.findOne({
      where: { expense_id: id },
      relations: ['staff'],
    });
    if (!expense) throw new NotFoundException(`Expense #${id} not found`);
    return expense;
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const staff = await this.staffRepo.findOne({
      where: { staff_id: createExpenseDto.staff_id },
    });
    if (!staff) {
      throw new NotFoundException(
        `Staff with ID ${createExpenseDto.staff_id} does not exist`,
      );
    }
    const expense = this.expenseRepo.create(createExpenseDto);
    return this.expenseRepo.save(expense);
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id);
    Object.assign(expense, updateExpenseDto);
    return this.expenseRepo.save(expense);
  }

  async remove(id: number): Promise<void> {
    const expense = await this.findOne(id);
    await this.expenseRepo.remove(expense);
  }
}
