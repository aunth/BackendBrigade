
import { Employee, HolidayRequest} from '../types/types';
import { getEmployees } from './dataManager';
import { employeeController } from '../controllers/employee.controller';
import { EmployeeInterface } from '../database_integration/models';
import { Connector, DatabaseType } from '../database_integration/db';

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

export function getDaysNum(request: HolidayRequest) {
  const endDate = new Date(request.end_date);
  const startDate = new Date(request.start_date);

  return (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1
}

export function getIdFromEmployee(employee: EmployeeInterface | Employee) {
    if (Connector.getType() == DatabaseType.MongoDB) {
        return (employee as EmployeeInterface)?._id;
    }
    else {
        return employee?.id;
    }
}


export async function getNameById(id: number): Promise<string | undefined> {
  const employees: Employee[] = await employeeController.getEmployees();
  
  const user = employees.find(employee => employee.id === id);
  
  if (!user) {
      return undefined;
  }
  return user.name;
}

export async function getCountryById(id: number): Promise<string> {
  const employees: Employee[] = await employeeController.getEmployees();
  const employee = employees.find(employee => employee.id === id);
  return employee ? employee.country : "";
}

export function findEmploee(employees: Employee[], empId: number){
  return employees.find(emp => emp.id === empId);
}
