import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';
import { OtherIncome } from '../../other-incomes/entities/other-income.entity';
import { PatientImage } from '../../patient-images/entities/patient-image.entity';
import { StaffRole } from 'src/common/enums/status.enums';
import { Doctors } from 'src/doctors/entities/doctors.entity';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  staff_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, unique: true })
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

  // Foreign key to link staff with doctor (when staff member is a doctor)
  @Column({ nullable: true })
  doctor_id: number;

  // Relationship to Doctors entity
  @OneToOne(() => Doctors, (doctor) => doctor.staff)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctors;
}
