/* eslint-disable prettier/prettier */


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreatmentPlans } from './entities/treatment-plans.entity';
import { CreateTreatmentPlansDto } from './dto/create-treatment-plans.dto';
import { UpdateTreatmentPlansDto } from './dto/update-treatment-plans.dto';


@Injectable()
export class TreatmentPlansService {
  constructor(
    @InjectRepository(TreatmentPlans)
    private readonly treatmentPlansRepository: Repository<TreatmentPlans>,
   
  ) {}

  async create(
    createTreatmentPlanDto: CreateTreatmentPlansDto,
  ): Promise<TreatmentPlans> {
    const treatmentPlan = this.treatmentPlansRepository.create(
      createTreatmentPlanDto,
    );
    return this.treatmentPlansRepository.save(treatmentPlan);
  }

  async findAll(
    offset = 0,
    limit = 10,
  ): Promise<{ data: TreatmentPlans[]; count: number }> {
    const [data, count] = await this.treatmentPlansRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, count };
  }

  async findOne(plan_id: number): Promise<TreatmentPlans> {
    const treatmentPlan = await this.treatmentPlansRepository.findOne({
      where: { plan_id },
    });

    if (!treatmentPlan) {
      throw new NotFoundException('Treatment plan not found');
    }

    return treatmentPlan;
  }

  async update(
    plan_id: number,
    updateTreatmentPlanDto: UpdateTreatmentPlansDto,
  ): Promise<TreatmentPlans> {
    const treatmentPlan = await this.findOne(plan_id);
    Object.assign(treatmentPlan, updateTreatmentPlanDto);
    return this.treatmentPlansRepository.save(treatmentPlan);
  }

  async remove(plan_id: number): Promise<{ message: string }> {
    const treatmentPlan = await this.findOne(plan_id);
    await this.treatmentPlansRepository.remove(treatmentPlan);
    return { message: 'Treatment plan deleted successfully' };
  }
}
