import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Doctors } from '../../doctors/entities/doctors.entity';
import { Appointment } from '../../appointments/entities/appointments.entity';
import { TreatmentPlans } from '../../treatment-plans/entities/treatment-plans.entity';

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

  @ManyToOne(() => Patient, (p) => p.procedures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctors, (d) => d.procedures, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctors;

  @ManyToOne(() => Appointment, (a) => a.procedures, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => TreatmentPlans, (tp) => tp.procedures, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'plan_id' })
  plan: TreatmentPlans;

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
