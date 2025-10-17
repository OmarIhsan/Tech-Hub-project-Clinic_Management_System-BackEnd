/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';
import { OtherIncome } from '../../other-incomes/entities/other-income.entity';
import { PatientImage } from '../../patient-images/entities/patient-image.entity';
import { StaffRole } from 'src/common/enums/status.enums';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  staff_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({ type: 'date', nullable: true })
  hire_date: Date;

  @Column({ default: StaffRole.STAFF })
  role: StaffRole;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Expense, (e) => e.staff)
  expenses: Expense[];

  @OneToMany(() => OtherIncome, (oi) => oi.staff)
  otherIncomes: OtherIncome[];

  @OneToMany(() => PatientImage, (img) => img.uploadedByStaff)
  uploadedImages: PatientImage[];
}
