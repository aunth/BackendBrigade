import { Employee, HolidayRequest, HolidayRule } from './types';

export const employees: Employee[] = [];
export const holidayRequests: HolidayRequest[] = [];
export const holidayRules: HolidayRule = {
  maxConsecutiveDays: 10,
  blackoutPeriods: [
    { start: new Date(2024, 11, 24), end: new Date(2024, 11, 26) }, // Example blackout period for Christmas
  ],
};
