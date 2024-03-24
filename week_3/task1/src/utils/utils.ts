
import { Employee, HolidayRequest} from '../types/types';
import { getEmployees } from './dataManager';
import { employeeController } from '../controllers/employee.controller';
import { EmployeeInterface, RequestInterface } from '../database_integration/models';
import { DBConnector, DatabaseType, dbConnector } from '../database_integration/db';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { Types } from 'mongoose';

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';


export function increaseUserHolidays(employeeId: number, daysNum: number) {
  const employees: Employee[] = getEmployees();
  const user = employees.find(employee => employee.id === employeeId);

  if (user) {
    user.remaining_holidays += daysNum;
  }
  return employees;
}

export function getDaysNum(request: HolidayRequest | RequestInterface) {
  const endDate = new Date(request.end_date);
  const startDate = new Date(request.start_date);

  return (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1
}

export async function getEmployeeId(employee: EmployeeInterface | Employee) {
  if (dbConnector.currentDatabaseType == DatabaseType.MongoDB) {
    return (employee as EmployeeInterface)._id;
  } else {
    return employee.id;
  }
}

export async function getNameById(id: number | Types.ObjectId): Promise<string | undefined> {
  const employee = await dbWorker.getEmployeeById(id);
  
  if (!employee) {
      return undefined;
  }
  return employee.name;
}

export async function getCountryById(id: number | Types.ObjectId): Promise<string> {
  const employee = await dbWorker.getEmployeeById(id)
  return employee ? employee.country : "";
}

export function findEmploee(employees: Employee[], empId: number){
  return employees.find(emp => emp.id === empId);
}
