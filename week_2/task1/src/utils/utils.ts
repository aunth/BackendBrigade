<<<<<<< HEAD

import { Employee, HolidayRequest} from '../types/types';
import * as fs from 'fs';
import axios, { AxiosError } from 'axios';
import { resourceUsage } from 'process';


export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';

export function getEmployees(id=0): Employee[] {
  try {
    const rawData = fs.readFileSync(employeesFilename, 'utf-8');
    const jsonData: Employee[] = JSON.parse(rawData);

    if (id === 0) {
      return jsonData;
    }
  
    const requestedRequests = jsonData.filter(employee => employee.id === id);
    return requestedRequests;
  } catch (error) {
    console.error('Error reading employees data:', error);
    return [];
  }
}

export function getHolidayRequests(id: number = 0): HolidayRequest[] {
  try {
      const rawData = fs.readFileSync(holidaysFilename, 'utf-8');
      const jsonData: HolidayRequest[] = JSON.parse(rawData);

      jsonData.forEach(request => {
          request.startDate = new Date(request.startDate);
          request.endDate = new Date(request.endDate);
      });

      // If no specific id is provided, return all requests
      if (id === 0) {
          return jsonData;
      }
      console.log(jsonData);
      console.log(id);
      
      const requestedRequests = jsonData.filter(request => request.idForRequest == id);
      console.log(requestedRequests);
      return requestedRequests;
  } catch (error) {
      console.error('Error reading holiday requests data:', error);
      return [];
  }
}

function updateHolidayRequestStatus(requestId: number, status: 'pending' | 'approved' | 'rejected') {
  try {
      const rawData = fs.readFileSync(holidaysFilename, 'utf-8');
      let jsonData: HolidayRequest[] = JSON.parse(rawData);
      
      const requestIndex = jsonData.findIndex(request => request.idForRequest === requestId);
      
      if (requestIndex !== -1) {
          jsonData[requestIndex].status = status;
          fs.writeFileSync(holidaysFilename, JSON.stringify(jsonData, null, 2));
          console.log(`Holiday request ${requestId} status updated to ${status}.`);
      } else {
          console.error(`Holiday request with ID ${requestId} not found.`);
      }
  } catch (error) {
      console.error('Error updating holiday request status:', error);
  }
}
=======
import { getEmployees } from './dataManager';
import { Employee} from '../types/types';
>>>>>>> 6aa8373927e717bdfad656e385819d9df56fbc6c

function updateEmployeeRemainingHolidays(employeeId: number, takenDays: number) {
  try {
      const rawData = fs.readFileSync(employeesFilename, 'utf-8');
      let jsonData: Employee[] = JSON.parse(rawData);
      
      const employeeIndex = jsonData.findIndex(employee => employee.id === employeeId);
      
      if (employeeIndex !== -1) {
          jsonData[employeeIndex].remainingHolidays -= takenDays;
          fs.writeFileSync(employeesFilename, JSON.stringify(jsonData, null, 2));
          console.log(`Employee ${employeeId} remaining holidays updated.`);
      } else {
          console.error(`Employee with ID ${employeeId} not found.`);
      }
  } catch (error) {
      console.error('Error updating employee remaining holidays:', error);
  }
}

export function rejectRequest(requestId: number) {
  updateHolidayRequestStatus(requestId, 'rejected');
  console.log(`Request with ${requestId} was rejected`);
}


export function approveRequest(requestId: number) {
  const holidayRequest = getHolidayRequests(requestId);

  if (holidayRequest.length == 0) {
      console.error('Holiday request not found');
      return;
  }

  let employee = getEmployees(holidayRequest[0].employeeId);

  if (!employee) {
      console.error('Employee not found');
      return;
  }

  const takenDays = getDaysNum(holidayRequest[0]);

  if (takenDays >= 0) {
      updateHolidayRequestStatus(requestId, 'approved');
      updateEmployeeRemainingHolidays(employee[0].id, takenDays);
      console.log('Request approved');
  } else {
      console.log('Insufficient remaining holidays');
  }
}

function saveEmployeesToJson(employees: Employee[]) {
  try {
      const jsonData = JSON.stringify(employees, null, 2);
      
      fs.writeFileSync(employeesFilename, jsonData);
      
      console.log('Changes saved to employees.json');
  } catch (error) {
      console.error('Error saving changes to JSON:', error);
  }
}

function increaseUserHolidays(employeeId: number, daysNum: number) {
  const employees: Employee[] = getEmployees();
  const user = employees.find(employee => employee.id === employeeId);

  if (user) {
    user.remainingHolidays += daysNum;
  }
  return employees;
}

function getDaysNum(request: HolidayRequest) {
  const endDate = new Date(request.endDate);
  const startDate = new Date(request.startDate);

  return (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1
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


export function deleteRequest(id: number): boolean {
  try {
      const rawData = fs.readFileSync(holidaysFilename, 'utf-8');
      let jsonData: HolidayRequest[] = JSON.parse(rawData);

      const requestIndex = jsonData.findIndex(request => request.idForRequest == id);

      if (requestIndex !== -1) {
          const request = jsonData[requestIndex];
          jsonData.splice(requestIndex, 1);

          const employees = increaseUserHolidays(request.employeeId, getDaysNum(request));

          fs.writeFileSync(holidaysFilename, JSON.stringify(jsonData, null, 2));

          saveHolidayRequests(jsonData);

          saveEmployeesToJson(employees);
          return true;
      } else {
          console.error(`Request with ID ${id} not found.`);
          return false;
      }
  } catch (error) {
      console.error('Error deleting holiday request:', error);
      return false;
  }
}

export function getNameById(id: number): string | undefined {
    const employees: Employee[] = getEmployees();
    const user = employees.find(employee => employee.id === id);
  
    if (!user) {
      return undefined;
    }
    return user.name;
}

export function getCountryById(id: number): string {
  const employees: Employee[] = getEmployees();
  const employee = employees.find(employee => employee.id === id);
  return employee ? employee.country : "";
}

export function findEmploee(employees: Employee[], empId: number){
  return employees.find(emp => emp.id === empId);
}
