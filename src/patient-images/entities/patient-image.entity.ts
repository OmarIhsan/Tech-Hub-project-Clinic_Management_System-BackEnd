import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Staff } from '../../staff/entities/entity.staff';

@Entity('patient_images')
export class PatientImage {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column()
  @Index('idx_patient_images_patient_id')
  patient_id: number;

  @Column({ length: 50 })
  image_type: string;

  @Column({ type: 'text' })
  file_path: string;

  @Column()
  @Index('idx_patient_images_staff_id')
  uploaded_by_staff_id: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  uploaded_at: Date;

  @ManyToOne(() => Patient, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Staff, (s) => s.uploadedImages, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'uploaded_by_staff_id' })
  uploadedByStaff: Staff;
}
