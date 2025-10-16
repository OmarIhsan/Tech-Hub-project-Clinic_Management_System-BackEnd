import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Doctors } from '../../doctors/entities/doctors.entity';
import { Appointment } from '../../appointments/entities/appointments.entity';
import { Procedures } from '../../procedures/entities/procedures.entity';
import { TreatmentPlanStatus } from '../../common/enums/status.enums';

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

  @ManyToOne(() => Patient, (p) => p.treatmentPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctors, (d) => d.treatmentPlans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctors;

  @ManyToOne(() => Appointment, (a) => a.treatmentPlans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => Procedures, (proc) => proc.plan)
  procedures: Procedures[];

  @Column('text')
  diagnosis_summary: string;

  @Column('text')
  plan_details: string;

  @Column({ type: 'bytea', nullable: true })
  prescription: Buffer;

  @Column({ type: 'varchar', length: 20, default: TreatmentPlanStatus.DRAFT })
  @Index('idx_treatment_plans_status')
  status: TreatmentPlanStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
