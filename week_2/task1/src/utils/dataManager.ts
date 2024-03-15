import { Employee, HolidayRequest } from '../types/types';
import * as fs from 'fs';

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';

export function getEmployees(): Employee[] {
    try {
      const rawData = fs.readFileSync(employeesFilename, 'utf-8');
      const jsonData: Employee[] = JSON.parse(rawData);
      return jsonData;
    } catch (error) {
      console.error('Error reading employees data:', error);
      return [];
    }
  }
  
  export function getHolidayRequests(): HolidayRequest[] {
    try {
      const rawData = fs.readFileSync(holidaysFilename, 'utf-8');
      const jsonData: HolidayRequest[] = JSON.parse(rawData);
  
      jsonData.forEach(request => {
        request.startDate = new Date(request.startDate);
        request.endDate = new Date(request.endDate);
      });
  
      return jsonData;
    } catch (error) {
      console.error('Error reading holiday requests data:', error);
      return [];
    }
  }
  
  export function saveHolidayRequest(newRequest: HolidayRequest): void {
    const holidayRequests = getHolidayRequests();
    holidayRequests.push(newRequest);
  
    try {
      fs.writeFileSync(holidaysFilename, JSON.stringify(holidayRequests, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing holiday requests data:', error);
    }
  }

  export function updateHolidayRequest(requestID: number, updatedRequest: HolidayRequest) {
    const holidayRequests = getHolidayRequests();
    const index = holidayRequests.findIndex(request => request.idForRequest === requestID);
    
    if (index === -1) {
      console.error('Request not found');
      return;
    }
    
    holidayRequests[index] = updatedRequest;
    
    try {
      fs.writeFileSync(holidaysFilename, JSON.stringify(holidayRequests, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing updated holiday requests data:', error);
          }
  }