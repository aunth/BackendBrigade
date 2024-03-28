import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Department } from './Department';
import { Request } from './Request';
import { EmployeeCredentials } from './EmployeeCredential';

@Entity('employees')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'department_id' })
  department_id: number;

  @Column()
  country: string;

  @Column()
  remaining_holidays: number;

  @OneToOne(() => EmployeeCredentials, credentials => credentials.employee)
  credentials: EmployeeCredentials;

  @OneToMany(() => Request, request => request.employee)
  requests: Request[];

  @ManyToOne(() => Department, department => department.employees, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'department_id' })
  department: Department;
}