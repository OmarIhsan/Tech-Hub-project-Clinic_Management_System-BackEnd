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
    // Convert prescription string to Buffer if it exists
    const treatmentPlanData = {
      ...createTreatmentPlanDto,
      prescription: createTreatmentPlanDto.prescription
        ? Buffer.from(createTreatmentPlanDto.prescription, 'base64') // adjust encoding if needed
        : undefined,
    };

    const treatmentPlan =
      this.treatmentPlansRepository.create(treatmentPlanData);
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

    const updateData = {
      ...updateTreatmentPlanDto,
      prescription: updateTreatmentPlanDto.prescription
        ? Buffer.from(updateTreatmentPlanDto.prescription, 'base64')
        : undefined,
    };

    Object.assign(treatmentPlan, updateData);
    return this.treatmentPlansRepository.save(treatmentPlan);
  }

  async remove(plan_id: number): Promise<{ message: string }> {
    const treatmentPlan = await this.findOne(plan_id);
    await this.treatmentPlansRepository.remove(treatmentPlan);
    return { message: 'Treatment plan deleted successfully' };
  }
}
