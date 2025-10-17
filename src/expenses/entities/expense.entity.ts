import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
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
  @Index('idx_expenses_staff_id')
  staff_id: number;

  @ManyToOne(() => Staff, (s) => s.expenses, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;
}
