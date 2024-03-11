import { employees } from "../../data/dataStore";

export function getNameById(id: number): string | undefined {
    const user = employees.find(employee => employee.id === id);
  
    if (!user) {
      return undefined;
    }
  
    return user.name;
  }