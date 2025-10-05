/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('procedures')
export class Procedures {
  @PrimaryGeneratedColumn()
  procedure_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @Column()
  appointment_id: number;

  @Column()
  plan_id: number;

  @Column()
  procedure_name: string;

  @Column('text')
  procedure_notes: string;

  @Column({ type: 'timestamp' })
  performed_at: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
