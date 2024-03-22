import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Employee } from './Employee';
import { BlackoutPeriod } from './BlackoutPeriod';

@Entity('departments')
export class Department extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  max_consecutive_days: number;

  @OneToMany(() => Employee, employee => employee.department)
  employees: Employee[];

  @OneToMany(() => BlackoutPeriod, blackoutPeriod => blackoutPeriod.department)
  blackoutPeriods: BlackoutPeriod[];
}