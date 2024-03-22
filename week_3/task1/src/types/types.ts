export interface Employee {
    id: number;
    name: string;
    department: DepartmentValues;
    country: string;
    remainingHolidays: number;
  }

export enum DepartmentValues {
    IT = 'IT',
    HR = 'HR',
    FINANCE = 'Finance',
    MARKETING = 'Marketing',
    SALES = 'Sales',
  }
  
  export interface HolidayRequest {
    idForRequest: number;
    employeeId: number;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'approved' | 'rejected';
  }
  
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