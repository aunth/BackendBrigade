import { Employee, HolidayRequest, HolidayRule, Department} from '../src/types/types';

export const employees: Employee[] = [
  { id: 1, name: 'John Doe', department: Department.IT, remainingHolidays: 1 },
  { id: 2, name: 'Jane Smith', department: Department.HR, remainingHolidays: 20 },
];


export const holidayRequests: HolidayRequest[] = [
  { idForRequest: 1, employeeId: 1, startDate: new Date('2024-04-01'), endDate: new Date('2024-04-05'), status: 'pending' },
  { idForRequest: 2, employeeId: 2, startDate: new Date('2024-05-10'), endDate: new Date('2024-05-15'), status: 'pending' },
  { idForRequest: 3, employeeId: 2, startDate: new Date('2024-06-20'), endDate: new Date('2024-06-25'), status: 'pending' }
];

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