import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointments.entity';
import { MedicalRecords } from '../../medical-records/entities/medical-records.entity';
import { TreatmentPlans } from '../../treatment-plans/entities/treatment-plans.entity';
import { Procedures } from '../../procedures/entities/procedures.entity';
import { ClinicalDocument } from '../../clinical-documents/entities/clinical-document.entity';
import { OtherIncome } from '../../other-incomes/entities/other-income.entity';
import { PatientImage } from '../../patient-images/entities/patient-image.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  patient_id: number;

  @Column({ length: 50 })
  full_name: string;

  @Column({ length: 10 })
  gender: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ length: 15 })
  phone: string;


  @Column({ length: 50 })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // ----------------- Relations (inverse sides) -----------------
  @OneToMany(() => Appointment, (a) => a.patient)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecords, (mr) => mr.patient)
  medicalRecords: MedicalRecords[];

  @OneToMany(() => TreatmentPlans, (tp) => tp.patient)
  treatmentPlans: TreatmentPlans[];

  @OneToMany(() => Procedures, (p) => p.patient)
  procedures: Procedures[];

  @OneToMany(() => ClinicalDocument, (cd) => cd.patient)
  clinicalDocuments: ClinicalDocument[];

  @OneToMany(() => OtherIncome, (oi) => oi.patient)
  otherIncomes: OtherIncome[];

  @OneToMany(() => PatientImage, (img) => img.patient)
  images: PatientImage[];
}
