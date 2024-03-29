import { AppDataSource } from "../database";
import { Department } from "../entity/Department";
import { Employee } from "../entity/Employee";
import {EmployeeCredentials } from "../entity/EmployeeCredential";


class EmployeeController {
    async getEmployees() {
        const employeeRepository = AppDataSource.getRepository(Employee);
        return await employeeRepository.find({ order: { id: 'ASC' } });
    }

    async createEmployee(mainData: Partial<Employee>, aunthData: Partial<EmployeeCredentials>) {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const credentialsRepository = AppDataSource.getRepository(EmployeeCredentials);
        
        let newEmployee = new Employee();
        newEmployee.name = mainData.name as string;
        newEmployee.department_id = mainData.department_id as number
       
        newEmployee.country = mainData.country as string;
        
        newEmployee.remaining_holidays = mainData.remaining_holidays as number;
        
        newEmployee.role = mainData.role as string;
        
        newEmployee = await employeeRepository.save(newEmployee);


        let newCredentials = new EmployeeCredentials();
        newCredentials.email = aunthData.email as string;
        newCredentials.password = aunthData.password as string;

        newCredentials.employee = newEmployee;

        newCredentials = await credentialsRepository.save(newCredentials);

        return { newEmployee, newCredentials };
    }

    async getEmployee(employeeName: string) {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ name: employeeName });
        if (!employee) {
            console.log('No employee found with that name.');
            return null;
        } else {
            return employee;
        }
    }

    async getEmployeeByJwt(jwtPayLoad: any) {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ id: jwtPayLoad.id } );
        console.log("Answer " + employee);
        if (!employee) {
            console.log('No employee found with that name.');
            return null;
        } else {
            return employee;
        }
    }

    async getEmployeeById(employeeId: number) {
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ id: employeeId });
        if (!employee) {
            console.log('No employee found with that name.');
            return null;
        } else {
            return employee;
        }
    }

    async getEmployeeIdByName(employeeName: string): Promise <number> {
    
        const employeeRepository = AppDataSource.getRepository(Employee);

        const employee = await employeeRepository.findOneBy({ name: employeeName });
        if (!employee) {
            console.log('No employee found with that name.');
            throw new Error('No employee found with that name.');
        } else {
            return employee.id
        }
    }

    async updateEmployeeRemainingHolidays(employeeId: number, takenDays: number) {
        const employeeRepository = AppDataSource.getRepository(Employee);
        
        // Find the employee by ID
        const employee = await employeeRepository.findOneBy({ id: employeeId });
        if (!employee) {
            console.error(`Employee with ID ${employeeId} not found.`);
            return;
        }
        
        // Update the employee's remaining holidays
        employee.remaining_holidays -= takenDays;
        
        try {
            await employeeRepository.save(employee);
            console.log(`Employee ${employeeId} remaining holidays updated.`);
        } catch (error) {
            console.error('Error updating employee remaining holidays:', error);
        }
    }
}

export const employeeController = new EmployeeController();
