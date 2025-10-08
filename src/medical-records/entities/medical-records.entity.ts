/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Doctors } from '../../doctors/entities/doctors.entity';

@Entity('medical_records')
export class MedicalRecords {
  @PrimaryGeneratedColumn()
  record_id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;

  @ManyToOne(() => Patient, (p) => p.medicalRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctors, (d) => d.medicalRecords, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctors;

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

  @Column('json', { nullable: true })
  current_meds_json: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
