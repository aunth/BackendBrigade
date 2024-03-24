import axios from 'axios';
import { Employee, Holiday, HolidayRequest} from '../types/types';
//import { getEmployees, getHolidayRequests } from './dataManager';
import { getCountryById } from './utils';
import { holidayRulesByDepartment } from '../../data/dataStore';
//import { updateEmployeeRemainingHolidays } from './dataManager';
import { getDaysNum } from './utils';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { dbWorker } from '../database_integration/DataBaseWorker';

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';

import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { departmentController } from '../controllers/department.controller';
import { blackoutPeriodsController } from '../controllers/blackoutperiods.controller';
import { DBConnector, DatabaseType } from '../database_integration/db';
import { Department } from '../entity/Department';
import { DepartmentInterface, EmployeeInterface, RequestInterface } from '../database_integration/models';


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

export async function validateRequestDates(startDate: string, endDate: string, employee: Employee | EmployeeInterface) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  console.log("validateRequestDates", start);
  console.log("validateRequestDates", end);

  if (start > end) {
      return 'Start date must be before end date';
  }

  const dayDifference = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
  console.log(dayDifference);

  const department = await dbWorker.getDepartment(employee);


  if (department == undefined) {
    console.log(`Error with processing of ${department}`);
  } else {
    if (DBConnector) {
      const consecutiveDays = department.max_consecutive_days;
      if (consecutiveDays == undefined) {
        console.log(`Problem with field max_consecutive_days in ${department}`);
      } else {
        if (dayDifference > consecutiveDays) {
          return 'Exceeds maximum consecutive holiday days';
        } else if (await dbWorker.getRemainingHolidays(employee) < dayDifference) {
          return 'Insufficient remaining holiday days';
        }
      }
    }

    // check for blackout
  const blackoutPeriods = await dbWorker.getBlackoutPeriods(department?.id);
  if (blackoutPeriods == undefined) {
    console.log(`Department with id: ${department._id}`)
  } else {
    console.log('blackoutPeriods', blackoutPeriods);
    const hasBlackoutPeriod = blackoutPeriods.some(period => {
    const blackoutStart = new Date(period.start_date.toLocaleDateString('en-CA'));
    const blackoutEnd = new Date(period.end_date.toLocaleDateString('en-CA'));

    console.log("start", start);
    console.log("end", end);
    console.log("blackoutStart", blackoutStart);
    console.log("blackoutEnd", blackoutEnd);

   
    return (start <= blackoutEnd && start >= blackoutStart) || (end <= blackoutEnd && end >= blackoutStart) || (start <= blackoutEnd && end >= blackoutStart)
  });

  if (hasBlackoutPeriod) {
    return `Request falls within a blackout period`; ///////////// check it (add info about blackout period) //////////
  }
  return null;
  }
}}


export async function getPublicHolidays(employeeId: Types.ObjectId | number) {
    const countryCode = await getCountryById(employeeId);
    return await getNextPublicHolidays(countryCode);
}

export async function checkHolidayConflicts(startDate: Date, endDate: Date, employeeId: Types.ObjectId | number) {
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

export async function isDuplicateRequest(newRequest: HolidayRequest | RequestInterface): Promise<boolean> {
    const holidayRequests = await dbWorker.getRequests();
    const duplicate = holidayRequests.some(request => {
      if (newRequest.employee_id == request.employee_id) {
  
        const existingStartDate = new Date(request.start_date.toLocaleDateString('en-CA'));
        const existingEndDate = new Date(request.end_date.toLocaleDateString('en-CA'));
        const newStartDate = new Date(newRequest.start_date);
        const newEndDate = new Date(newRequest.end_date);
  
        const isExactMatch = existingStartDate.getTime() === newStartDate.getTime() && existingEndDate.getTime() === newEndDate.getTime();
        return isExactMatch;
      }
      return false;
    });
    return duplicate;
}


export async function createRequestObject(employeeId: string | Types.ObjectId, startDate: string, endDate: string): Promise<HolidayRequest | RequestInterface> {
  const start_date = new Date(startDate);
  const end_date = new Date(endDate);
  const status = "pending";
  
  if (!isNaN(Number(employeeId))) {
      return {
          employee_id: Number(employeeId),
          start_date,
          end_date,
          status
      } as HolidayRequest;
  } else if (Types.ObjectId.isValid(employeeId)) {
      return {
          _id: new Types.ObjectId(), 
          employee_id: new Types.ObjectId(employeeId),
          start_date,
          end_date,
          status
      } as RequestInterface;
  } else {
      throw new Error('Invalid employeeId format');
  }
}


export async function updateRequestObject(employeeId: string | Types.ObjectId, startDate: string, endDate: string): Promise<HolidayRequest | RequestInterface> {
  const start_date = new Date(startDate);
  const end_date = new Date(endDate);
  
  if (!isNaN(Number(employeeId))) {
      return { 
        employee_id: Number(employeeId),
        start_date,
        end_date,
      } as HolidayRequest;
  } else if (Types.ObjectId.isValid(employeeId)) {
      return {
        employee_id: new Types.ObjectId(employeeId),
        start_date,
        end_date,
      } as RequestInterface;
  } else {
      throw new Error('Invalid employeeId format');
  }
}


export function saveHolidayRequests(requests: HolidayRequest[]) {
  try {
    const jsonData = JSON.stringify(requests, null, 2);
    fs.writeFileSync(holidaysFilename, jsonData);
    console.log(`Holiday requests saved to ${holidaysFilename}`);
  } catch (error) {
    console.error(`Error saving holiday requests to ${holidaysFilename}:`, error);
  }
}

export async function rejectRequest(requestId: number | Types.ObjectId) {
 await dbWorker.updateRequest(requestId as Types.ObjectId, {status: 'rejected'});
 console.log(`Request with ${requestId} was rejected`);
}


export async function approveRequest(requestId: Types.ObjectId |string) {
  const holidayRequest = await dbWorker.getRequestById(requestId);

  if (!holidayRequest) {
      console.error('Holiday request not found');
      return;
  }

  const employee = await dbWorker.getEmployeeById(holidayRequest.employee_id);

  if (!employee) {
      console.error('Employee not found');
      return;
  }

  const takenDays = getDaysNum(holidayRequest);
  console.log("takenDays", takenDays);

  if (takenDays >= 0) {
      await dbWorker.updateRequest(requestId as Types.ObjectId, {status: 'approved'});
      await dbWorker.updateEmployeeById(employee.id, {remaining_holidays: employee.remaining_holidays - takenDays});
      console.log('Request approved');
  } else {
      console.log('Insufficient remaining holidays');
  }
}