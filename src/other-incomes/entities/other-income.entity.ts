/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Staff } from '../../staff/entities/entity.staff';

@Entity('other_incomes')
export class OtherIncome {
  @PrimaryGeneratedColumn()
  income_id: number;

  @Column({ length: 50 })
  source: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  income_date: Date;

  @Column()
  @Index('idx_other_incomes_staff_id')
  staff_id: number;

  @Column()
  @Index('idx_other_incomes_patient_id')
  patient_id: number;

  @ManyToOne(() => Staff, (s) => s.otherIncomes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => Patient, (p) => p.otherIncomes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
