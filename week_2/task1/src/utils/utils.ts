import { getEmployees } from './dataManager';
import { Employee} from '../types/types';


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
