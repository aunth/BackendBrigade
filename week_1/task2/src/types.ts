export interface Employee {
    id: number;
    name: string;
    remainingHolidays: number;
  }
  
  export interface HolidayRequest {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'approved' | 'rejected';
  }
  
  export interface HolidayRule {
    maxConsecutiveDays: number;
    blackoutPeriods: { start: Date; end: Date }[];
  }