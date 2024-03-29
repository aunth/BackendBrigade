import { Entity, PrimaryGeneratedColumn, Column, OneToOne, BaseEntity, JoinColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity('employee_credentials')
export class EmployeeCredentials extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'employee_id' })
  employee_id: number;

  @Column({ type: 'text', nullable: true })
  two_fa_code: string | null;

  @OneToOne(() => Employee, employee => employee.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}