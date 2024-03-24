
export interface Employee {
    id: number;
    name: string;
    //department: DepartmentValues;
    department_id: number;
    country: string;
    remaining_holidays: number;
  }

export enum DepartmentValues {
    IT = 'IT',
    HR = 'HR',
    FINANCE = 'Finance',
    MARKETING = 'Marketing',
    SALES = 'Sales',
  }

  export interface DepartmentSQL {
    id: number,
    name: string,
    max_consecutive_days: number,
  }
  
  export interface HolidayRequest {
    id: number;
    employee_id: number;
    start_date: Date;
    end_date: Date;
    status: 'pending' | 'approved' | 'rejected';
  }

  export interface DepartmentSQL {
    id: number,
    name: string,
    max_consecutive_days: number,
  }

  //export interface HolidayRequestForSQL {
  //  id: number;
  //  employee_id: number;
  //  start_date: Date;
  //  end_date: Date;
  //  status: 'pending' | 'approved' | 'rejected';
  //}
  
  export interface HolidayRule {
    maxConsecutiveDays: number;
    blackoutPeriods: { start: Date; end: Date }[];
  }

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: null;
  launchYear: null;
  types: string[];
}