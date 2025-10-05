/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('medical_records')
export class MedicalRecords {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column('text')
  diagnosis: string;

  @Column('text')
  clinical_findings: string;

  @Column('text')
  treatment: string;

  @Column('text')
  allergies: string;

  @Column('text')
  medical_conditions: string;

  @Column('jsonb', { nullable: true })
  current_meds_json: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
