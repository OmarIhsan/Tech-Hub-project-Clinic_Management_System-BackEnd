import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Doctors } from '../../doctors/entities/doctors.entity';
import { TreatmentPlans } from '../../treatment-plans/entities/treatment-plans.entity';
import { Procedures } from '../../procedures/entities/procedures.entity';
import { ClinicalDocument } from '../../clinical-documents/entities/clinical-document.entity';
import { AppointmentStatus } from '../../common/enums/status.enums';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  status: AppointmentStatus;

  @Column({ type: 'timestamp' })
  appointment_time: Date;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @ManyToOne(() => Patient, (p) => p.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctors, (d) => d.appointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctors;

  @OneToMany(() => TreatmentPlans, (tp) => tp.appointment)
  treatmentPlans: TreatmentPlans[];

  @OneToMany(() => Procedures, (proc) => proc.appointment)
  procedures: Procedures[];

  @OneToMany(() => ClinicalDocument, (cd) => cd.appointment)
  clinicalDocuments: ClinicalDocument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
