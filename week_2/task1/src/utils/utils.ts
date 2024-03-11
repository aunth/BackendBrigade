
import { Employee, HolidayRequest } from '../types/types';
import * as fs from 'fs';

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';

export function getEmployees(): Employee[] {
  const rawData = fs.readFileSync(employeesFilename);
  const jsonData: Employee[] = JSON.parse(rawData.toString());
  return jsonData;
}

export function getHolidayRequests(): HolidayRequest[] {
  const rawData = fs.readFileSync(holidaysFilename);
  const jsonData: HolidayRequest[] = JSON.parse(rawData.toString());

  jsonData.forEach(request => {
    request.startDate = new Date(request.startDate);
    request.endDate = new Date(request.endDate);
  });

  return jsonData;
}

export function getNameById(id: number): string | undefined {
    const employees: Employee[] = getEmployees();
    const user = employees.find(employee => employee.id === id);
  
    if (!user) {
      return undefined;
    }
    return user.name;
}