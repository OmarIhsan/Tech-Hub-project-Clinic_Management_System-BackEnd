/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('treatment_plans')
export class TreatmentPlans {
  @PrimaryGeneratedColumn()
  plan_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  appointment_id: number;

  @Column('text')
  diagnosis_summary: string;

  @Column('text')
  plan_details: string;

  @Column({ type: 'bytea', nullable: true })
  prescription: Buffer;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
