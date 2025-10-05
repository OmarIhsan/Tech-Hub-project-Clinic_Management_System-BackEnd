import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtherIncome } from './entities/other-income.entity';
import { CreateOtherIncomeDto } from './dto/create-other-income.dto';
import { UpdateOtherIncomeDto } from './dto/update-other-income.dto';

@Injectable()
export class OtherIncomesService {
    constructor(
        @InjectRepository(OtherIncome)
        private readonly otherIncomeRepo: Repository<OtherIncome>,
    ) { }

    findAll(): Promise<OtherIncome[]> {
        return this.otherIncomeRepo.find({ relations: ['staff', 'patient'] });
    }

    async findOne(id: number): Promise<OtherIncome> {
        const otherIncome = await this.otherIncomeRepo.findOne({
            where: { income_id: id },
            relations: ['staff', 'patient']
        });
        if (!otherIncome) throw new NotFoundException(`Other Income #${id} not found`);
        return otherIncome;
    }

    create(createOtherIncomeDto: CreateOtherIncomeDto): Promise<OtherIncome> {
        const otherIncome = this.otherIncomeRepo.create(createOtherIncomeDto);
        return this.otherIncomeRepo.save(otherIncome);
    }

    async update(id: number, updateOtherIncomeDto: UpdateOtherIncomeDto): Promise<OtherIncome> {
        const otherIncome = await this.findOne(id);
        Object.assign(otherIncome, updateOtherIncomeDto);
        return this.otherIncomeRepo.save(otherIncome);
    }

    async remove(id: number): Promise<void> {
        const otherIncome = await this.findOne(id);
        await this.otherIncomeRepo.remove(otherIncome);
    }
}
