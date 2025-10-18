import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MedicalRecords } from '../../medical-records/entities/medical-records.entity';
import { TreatmentPlans } from '../../treatment-plans/entities/treatment-plans.entity';
import { Procedures } from '../../procedures/entities/procedures.entity';
import { Appointment } from '../../appointments/entities/appointments.entity';

@Entity('doctors')
export class Doctors {
  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column()
  full_name: string;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'timestamp' })
  hire_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, (a) => a.doctor)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecords, (mr) => mr.doctor)
  medicalRecords: MedicalRecords[];

  @OneToMany(() => TreatmentPlans, (tp) => tp.doctor)
  treatmentPlans: TreatmentPlans[];

  @OneToMany(() => Procedures, (p) => p.doctor)
  procedures: Procedures[];
}
