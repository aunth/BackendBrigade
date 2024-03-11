
export interface Employee {
    id: number;
    name: string;
    department: Department;
    remainingHolidays: number;
  }

export enum Department {
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