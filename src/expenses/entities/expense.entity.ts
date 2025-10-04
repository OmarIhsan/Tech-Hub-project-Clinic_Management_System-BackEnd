import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from '../../staff/entities/entity.staff';

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn()
    expense_id: number;

    @Column({ length: 50 })
    category: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    expense_date: Date;

    @Column({ type: 'text' })
    reason: string;

    @Column()
    staff_id: number;

    @ManyToOne(() => Staff)
    @JoinColumn({ name: 'staff_id' })
    staff: Staff;
}
