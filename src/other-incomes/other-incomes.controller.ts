import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { OtherIncomesService } from './other-incomes.service';
import { OtherIncome } from './entities/other-income.entity';
import { CreateOtherIncomeDto } from './dto/create-other-income.dto';
import { UpdateOtherIncomeDto } from './dto/update-other-income.dto';

@Controller('other-incomes')
export class OtherIncomesController {
    constructor(private readonly otherIncomesService: OtherIncomesService) { }

    @Get()
    getAll(): Promise<OtherIncome[]> {
        return this.otherIncomesService.findAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number): Promise<OtherIncome> {
        return this.otherIncomesService.findOne(id);
    }

    @Post()
    create(@Body() createOtherIncomeDto: CreateOtherIncomeDto): Promise<OtherIncome> {
        return this.otherIncomesService.create(createOtherIncomeDto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateOtherIncomeDto: UpdateOtherIncomeDto): Promise<OtherIncome> {
        return this.otherIncomesService.update(id, updateOtherIncomeDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.otherIncomesService.remove(id);
    }
}
