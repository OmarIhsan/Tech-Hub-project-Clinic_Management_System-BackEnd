import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entitiy';
import { Staff } from '../../staff/entities/entity.staff';

@Entity('other_incomes')
export class OtherIncome {
    @PrimaryGeneratedColumn()
    income_id: number;

    @Column({ length: 50 })
    source: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    income_date: Date;

    @Column()
    staff_id: number;

    @Column()
    patient_id: number;

    @ManyToOne(() => Staff)
    @JoinColumn({ name: 'staff_id' })
    staff: Staff;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
}
