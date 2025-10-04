import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ type: 'text', nullable: true })
  allergies_text: string;

  @Column({ type: 'text', nullable: true })
  medical_conditions_text: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
