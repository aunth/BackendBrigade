import axios from 'axios';
import { Employee, Holiday, HolidayRequest} from '../types/types';
//import { getEmployees, getHolidayRequests } from './dataManager';
import { getCountryById } from './utils';
import { holidayRulesByDepartment } from '../../data/dataStore';
import { getDaysNum } from '../utils/utils';
//import { updateEmployeeRemainingHolidays } from './dataManager';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { dbWorker } from '../database_integration/DataBaseWorker';

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';

import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { departmentController } from '../controllers/department.controller';
import { blackoutPeriodsController } from '../controllers/blackoutperiods.controller';
import { Connector, DatabaseType } from '../database_integration/db';
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
    if (Connector.getType() == DatabaseType.PostgreSQL) {
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

  const blackoutPeriods = await dbWorker.getBlackoutPeriods(department?.id);
  console.log('blackoutPeriods', blackoutPeriods);
  const hasBlackoutPeriod = blackoutPeriods.some(period => {
    const blackoutStart = new Date(period.startDate.toLocaleDateString('en-CA'));
    const blackoutEnd = new Date(period.endDate.toLocaleDateString('en-CA'));

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

//function updateHolidayRequestStatus(requestId: number, status: 'pending' | 'approved' | 'rejected') {
//  try {
//      const rawData = fs.readFileSync(holidaysFilename, 'utf-8');
//      let jsonData: HolidayRequest[] = JSON.parse(rawData);
//      
//      const requestIndex = jsonData.findIndex(request => request.idForRequest === requestId);
//      
//      if (requestIndex !== -1) {
//          jsonData[requestIndex].status = status;
//          fs.writeFileSync(holidaysFilename, JSON.stringify(jsonData, null, 2));
//          console.log(`Holiday request ${requestId} status updated to ${status}.`);
//      } else {
//          console.error(`Holiday request with ID ${requestId} not found.`);
//      }
//  } catch (error) {
//      console.error('Error updating holiday request status:', error);
//  }
//}

export async function getPublicHolidays(employeeId: Types.ObjectId | number) {
    const empId = Number(employeeId);
    const countryCode = await getCountryById(empId);
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
    const  
    const duplicate = holidayRequests.some(request => {
      if ( === newRequest.employee_id) {
  
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

export function saveHolidayRequests(requests: HolidayRequest[]) {
  try {
    const jsonData = JSON.stringify(requests, null, 2);
    fs.writeFileSync(holidaysFilename, jsonData);
    console.log(`Holiday requests saved to ${holidaysFilename}`);
  } catch (error) {
    console.error(`Error saving holiday requests to ${holidaysFilename}:`, error);
  }
}

//export function rejectRequest(requestId: number) {
//  updateHolidayRequestStatus(requestId, 'rejected');
//  console.log(`Request with ${requestId} was rejected`);
//}


export async function approveRequest(requestId: string) {
  //const holidayRequest = getHolidayRequests(requestId);
  const holidayRequest =  await requestController.getRequest(requestId);

  if (!holidayRequest) {
      console.error('Holiday request not found');
      return;
  }

  //let employee = getEmployees(holidayRequest[0].employeeId);
  const employee = await employeeController.getEmployee(holidayRequest.employee_id)

  if (!employee) {
      console.error('Employee not found');
      return;
  }

  const takenDays = getDaysNum(holidayRequest);
  console.log("takenDays", takenDays);

  if (takenDays >= 0) {
      //updateHolidayRequestStatus(requestId, 'approved');
      //await requestController.updateRequestStatus(requestId, 'approved')
      await employeeController.updateEmployeeRemainingHolidays(employee.id, takenDays);
      console.log('Request approved');
  } else {
      console.log('Insufficient remaining holidays');
  }
}