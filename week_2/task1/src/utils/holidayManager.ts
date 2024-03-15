import axios from 'axios';
import { Employee, Holiday, HolidayRequest } from '../types/types';
import { getEmployees, getHolidayRequests } from './dataManager';
import { getCountryById } from './utils';
import { holidayRulesByDepartment } from '../../data/dataStore';


export async function getNextPublicHolidays(countryCode: string) {
    try {
      const response = await axios.get(`https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error('Error fetching public holidays:', error.message);
          console.error('Response status:', error.response?.status);
          console.error('Response data:', error.response?.data);
      } else {
          console.error('An unexpected error occurred:', error);
      }
      return []; 
    }
}

export function validateRequestDates(startDate: string, endDate: string, employee: Employee) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
        return 'Start date must be before end date';
    }
  
    const dayDifference = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (dayDifference > holidayRulesByDepartment[employee.department].maxConsecutiveDays) {
        return 'Exceeds maximum consecutive holiday days';
    } else if (employee.remainingHolidays < dayDifference) {
        return 'Insufficient remaining holiday days';
    }
  
    // Check for blackout periods
    const hasBlackoutPeriod = holidayRulesByDepartment[employee.department].blackoutPeriods.some(period => {
      const blackoutStart = new Date(period.start);
      const blackoutEnd = new Date(period.end);
     
      return (start <= blackoutEnd && start >= blackoutStart) || (end <= blackoutEnd && end >= blackoutStart);
    });
  
    if (hasBlackoutPeriod) {
      return 'Request falls within a blackout period';
    }
    
    return null;
}

export async function getPublicHolidays(employeeId: string) {
    const empId = Number(employeeId);
    const countryCode = getCountryById(empId);
    return await getNextPublicHolidays(countryCode);
}

export async function checkHolidayConflicts(startDate: Date, endDate: Date, employeeId: string) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const holidays = await getPublicHolidays(employeeId);
      const holidayConflict = holidays.filter((holiday: Holiday) => {
        const holidayDate = new Date(holiday.date);
        return start <= holidayDate && holidayDate <= end;
      });
  
      if (holidayConflict.length > 0) {
        let dates = holidayConflict.map((holiday: Holiday) => holiday.date).join(', ');
        return `Request conflicts with a public holiday (${dates}). Please choose different dates.`;
      }
      
      return null;
    } catch (error) {
      console.error("Failed to check for holiday conflicts:", error);
    }
}

export function isDuplicateRequest(newRequest: HolidayRequest): boolean {
    const holidayRequests = getHolidayRequests();
  
    const duplicate = holidayRequests.some(request => {
      if (request.employeeId === newRequest.employeeId) {
  
        const existingStartDate = new Date(request.startDate);
        const existingEndDate = new Date(request.endDate);
        const newStartDate = new Date(newRequest.startDate);
        const newEndDate = new Date(newRequest.endDate);
  
        const isExactMatch = existingStartDate.getTime() === newStartDate.getTime() && existingEndDate.getTime() === newEndDate.getTime();
  
        return isExactMatch;
      }
      return false;
    });
    return duplicate;
}