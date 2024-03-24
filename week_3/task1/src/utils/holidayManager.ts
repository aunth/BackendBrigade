import axios from 'axios';
import { Employee, Holiday, HolidayRequest} from '../types/types';
import { getCountryById } from './utils';
import { getDaysNum } from './utils';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { dbWorker } from '../database_integration/DataBaseWorker';

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';


import { employeeController } from '../controllers/employee.controller';
import { DBConnector, DatabaseType, dbConnector } from '../database_integration/db';
import { EmployeeInterface, RequestInterface } from '../database_integration/models';


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


  if (start > end) {
      return 'Start date must be before end date';
  }

  const dayDifference = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;

  const department = await dbWorker.getDepartment(employee);

  if (!department) {
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

  const blackoutPeriods = await dbWorker.getBlackoutPeriods(department?._id ? department._id : 0);

  if (blackoutPeriods == undefined) {
    console.log(`Department with id: ${department._id}`)
  } else {
    const hasBlackoutPeriod = blackoutPeriods.some(period => {
    const blackoutStart = new Date(period.start_date.toLocaleDateString('en-CA'));
    const blackoutEnd = new Date(period.end_date.toLocaleDateString('en-CA'));

    return (start <= blackoutEnd && start >= blackoutStart) || (end <= blackoutEnd && end >= blackoutStart) || (start <= blackoutEnd && end >= blackoutStart);
  });

  if (hasBlackoutPeriod) {
    return `Request falls within a blackout period`;
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
  console.log("New request + ", newRequest);
  const holidayRequests = await dbWorker.getRequests();
  console.log('All requests: ' + holidayRequests);
  const duplicate = holidayRequests.some(request => {
    console.log(`${newRequest.employee_id} vs ${request.employee_id} == ${newRequest.employee_id === request.employee_id}`);
      if (newRequest.employee_id == request.employee_id) {
          const existingStartDate = new Date(request.start_date);
          const existingEndDate = new Date(request.end_date);
          const newStartDate = new Date(newRequest.start_date);
          const newEndDate = new Date(newRequest.end_date);

          console.log("Existing Start Date:", existingStartDate);
          console.log("Existing End Date:", existingEndDate);
          console.log("New Start Date:", newStartDate);
          console.log("New End Date:", newEndDate);

          const isExactMatch = existingStartDate.getTime() == newStartDate.getTime() &&
                              existingEndDate.getTime() == newEndDate.getTime();

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
          employee_id: employeeId,
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

export async function rejectRequest(requestId: string | Types.ObjectId) {
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

  if (takenDays >= 0) {
      await dbWorker.updateRequest(requestId as Types.ObjectId, {status: 'approved'});
      if (dbConnector.currentDatabaseType == DatabaseType.MongoDB) {
        await dbWorker.updateEmployeeById((employee as EmployeeInterface)._id, {remaining_holidays: employee.remaining_holidays - takenDays});
      } else {
        await employeeController.updateEmployeeRemainingHolidays((employee as Employee).id, takenDays);
      }
      console.log('Request approved');
      
  } else {
      console.log('Insufficient remaining holidays');
  }
}