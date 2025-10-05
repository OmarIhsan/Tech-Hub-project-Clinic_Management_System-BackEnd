import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Staff } from '../../staff/entities/entity.staff';

@Entity('patient_images')
export class PatientImage {
    @PrimaryGeneratedColumn()
    image_id: number;

    @Column()
    patient_id: number;

    @Column({ length: 50 })
    image_type: string;

    @Column({ type: 'text' })
    file_path: string;

    @Column()
    uploaded_by_staff_id: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamp' })
    uploaded_at: Date;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @ManyToOne(() => Staff)
    @JoinColumn({ name: 'uploaded_by_staff_id' })
    uploadedByStaff: Staff;
}
