import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Appointment } from '../../appointments/entities/appointments.entity';

@Entity('clinical_documents')
export class ClinicalDocument {
    @PrimaryGeneratedColumn()
    document_id: number;

    @Column()
    patient_id: number;

    @Column()
    appointment_id: number;

    @Column({ length: 50 })
    document_type: string;

    @Column({ length: 50 })
    consent_version: string;

    @Column({ type: 'text' })
    file_path: string;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @ManyToOne(() => Appointment, (a) => a.clinicalDocuments, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment;
}
