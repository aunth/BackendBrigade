import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { Employee } from './Employee';


@Entity('requests')
export class Request extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employee_id: number;

  @Column('timestamp')
  start_date: Date;

  @Column('timestamp')
  end_date: Date;

  @Column({
    type: 'varchar',
  })
  status: 'pending' | 'approved' | 'rejected';

  @ManyToOne(() => Employee, employee => employee.requests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}