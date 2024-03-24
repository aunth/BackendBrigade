import { Employee, HolidayRequest } from '../types/types';
import * as fs from 'fs';

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

export function getRequests(id: number) {
  const rawData = fs.readFileSync(holidaysFilename, 'utf-8');
  const jsonData: HolidayRequest[] = JSON.parse(rawData);
  return jsonData.filter(request => request.employee_id == id);

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
