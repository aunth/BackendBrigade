import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { Department } from './Department';

@Entity('blackoutperiods')
export class BlackoutPeriod extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  department_id: number;

  @Column('timestamp')
  start_date: Date;

  @Column('timestamp')
  end_date: Date;

  @ManyToOne(() => Department, department => department.blackoutPeriods)
  department: Department;
}
