import { AppDataSource } from "../database";
import { Employee } from "../entity/Employee";


class EmployeeController {
    async getEmployees() {
        // Use TypeORM's repository API to find all employees
        const employeeRepository = AppDataSource.getRepository(Employee);
        return await employeeRepository.find({ order: { id: 'ASC' } });
    }

    async getEmployee(employeeName: string) {
        // Use TypeORM's repository API to find a single employee by ID
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
