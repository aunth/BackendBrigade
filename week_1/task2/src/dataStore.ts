import { Employee, HolidayRequest, HolidayRule, Department} from './types.js';

export const employees: Employee[] = [];
export const holidayRequests: HolidayRequest[] = [];

export const holidayRulesByDepartment: { [key in Department]: HolidayRule } = {
  [Department.IT]: {
    maxConsecutiveDays: 10,
    blackoutPeriods: [
      { start: new Date(2024, 11, 24), end: new Date(2024, 11, 26) }
    ]
  },
  [Department.HR]: {
    maxConsecutiveDays: 12,
    blackoutPeriods: [
      { start: new Date(2024, 6, 1), end: new Date(2024, 6, 15) }
    ]
  },
  [Department.FINANCE]: {
    maxConsecutiveDays: 15,
    blackoutPeriods: [
      { start: new Date(2024, 2, 1), end: new Date(2024, 2, 15) }
    ]
  },
  [Department.MARKETING]: {
    maxConsecutiveDays: 8,
    blackoutPeriods: [
      { start: new Date(2024, 4, 1), end: new Date(2024, 4, 7) }
    ]
  },
  [Department.SALES]: {
    maxConsecutiveDays: 7,
    blackoutPeriods: [
      { start: new Date(2024, 9, 1), end: new Date(2024, 9, 7) }
    ]
  },
};
