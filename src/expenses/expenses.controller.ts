import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Get()
    getAll(): Promise<Expense[]> {
        return this.expensesService.findAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number): Promise<Expense> {
        return this.expensesService.findOne(id);
    }

    @Post()
    create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
        return this.expensesService.create(createExpenseDto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
        return this.expensesService.update(id, updateExpenseDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.expensesService.remove(id);
    }
}
