import { HolidayRule, DepartmentValues } from '../src/types/types';

export const holidayRulesByDepartment: { [key in DepartmentValues]: HolidayRule } = {
  [DepartmentValues.IT]: {
    maxConsecutiveDays: 10,
    blackoutPeriods: [
      { start: new Date(2024, 2, 14), end: new Date(2024, 2, 16) }
    ]
  },
  [DepartmentValues.HR]: {
    maxConsecutiveDays: 12,
    blackoutPeriods: [
      { start: new Date(2024, 6, 1), end: new Date(2024, 6, 15) }
    ]
  },
  [DepartmentValues.FINANCE]: {
    maxConsecutiveDays: 15,
    blackoutPeriods: [
      { start: new Date(2024, 2, 1), end: new Date(2024, 2, 15) }
    ]
  },
  [DepartmentValues.MARKETING]: {
    maxConsecutiveDays: 8,
    blackoutPeriods: [
      { start: new Date(2024, 4, 1), end: new Date(2024, 4, 7) }
    ]
  },
  [DepartmentValues.SALES]: {
    maxConsecutiveDays: 7,
    blackoutPeriods: [
      { start: new Date(2024, 9, 1), end: new Date(2024, 9, 7) }
    ]
  },
};