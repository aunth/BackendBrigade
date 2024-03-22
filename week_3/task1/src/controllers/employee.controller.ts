import { AppDataSource } from "../database";
import { Employee } from "../entity/Employee";

class EmployeeController {
    async getEmployees() {
        // Use TypeORM's repository API to find all employees
        const employeeRepository = AppDataSource.getRepository(Employee);
        return await employeeRepository.find({ order: { id: 'ASC' } });
    }

    async getEmployee(employeeId: number) {
        // Use TypeORM's repository API to find a single employee by ID
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOneBy({ id: employeeId });
        if (!employee) {
            console.log('No employee found with that ID.');
            return null;
        } else {
            return employee;
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

//import { db } from "../database"
//
//class EmployeeController {
//    async getEmployees() {
//        const employees = await db.query('SELECT * FROM employees ORDER BY id ASC;');
//        return employees.rows;
//    }
//
//    async getEmployee(employeeId: number) {
//        const query = 'SELECT * FROM Employees WHERE id = $1';
//        const values = [employeeId];
//        
//        const res = await db.query(query, values);
//        if (res.rows.length === 0) {
//            console.log('No employee found with that ID.');
//            return null; // or undefined, or any value you prefer to indicate "not found"
//        } else {
//            return res.rows[0]; // Return the employee data
//        }
//    }
//
//    async updateEmployeeRemainingHolidays(employeeId: number, takenDays:number) {
//        const query = `UPDATE employees SET remaining_holidays = remaining_holidays - $1 WHERE id = $2`;
//        try {
//            const res = await db.query(query, [takenDays, employeeId]);
//            if (res.rowCount === 0) {
//                console.error(`Employee with ID ${employeeId} not found.`);
//            } else {
//                console.log(`Employee ${employeeId} remaining holidays updated.`);
//            }
//        } catch (error) {
//            console.error('Error updating employee remaining holidays:', error);
//        }
//    }
//}
//
//export const employeeController = new EmployeeController();