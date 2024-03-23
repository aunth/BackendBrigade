import { employeeWorker } from "./EmployeeWorker";
import { blackoutPeriodWorker } from "./HolidayWorker";
import { departmentWorker } from "./DepartmentWorker";
import { requestWorker } from "./RequestWorker";
import { DepartmentValues, Employee, HolidayRequest } from "../types/types";
import { Connector, DBConnector, DatabaseType } from "./db";
import { EmployeeInterface, DepartmentInterface, BlackoutPeriodModel, EmployeeModel, BlackoutPeriodInterface } from "./models";
import { Department } from "../entity/Department";
import { Types } from "mongoose";
import { getEmployees } from "../utils/dataManager";
import { holidayRulesByDepartment } from "../../data/dataStore";
import { RequestInterface } from "./models";
import { BlackoutPeriod } from "../entity/BlackoutPeriod";


export class DBWorker {

    async writeEmployee(data: Employee): Promise<EmployeeInterface> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await employeeWorker.insertOne(data); // Use MongoDB worker
        } else {
            throw new Error('Employee data currently only supported in MongoDB');
        }
    }

    async getEmployeeIdByName(name: string): Promise<Types.ObjectId | number | undefined> {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return (await employeeWorker.getByName(name))?._id;
            } else {
                throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error retrieving employees by name:', error);
            throw error; // Re-throw for further handling
        }

    }

    async getEmployeesByName(name: string): Promise<EmployeeInterface | null> {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return await employeeWorker.getByName(name);
            } else {
                throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error retrieving employees by name:', error);
            throw error; // Re-throw for further handling
        }
    }

    async getBlackoutPeriods(id: Types.ObjectId | number) {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return await departmentWorker.getBlackoutPeriod(id as Types.ObjectId);
            } else {
                throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error(`Error retrieving blackoutPeriods for department with id: ${id}:`, error);
            throw error;
        }
    }

    async getRequests() {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return await requestWorker.findAllRequests();
            } else {
                throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error(`Error retrieving all requests:`, error);
            throw error;
        }

    }

    async getHolidayRequestsByEmployeeId(id: Types.ObjectId | number) {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return (await requestWorker.findRequestsByEmployeeId(id as Types.ObjectId)).filter(
                    (request: RequestInterface) => request.status == 'pending'
                );
            } else {
                throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error(`Error retrieving holidays for employee with id: ${id}:`, error);
            throw error;
        }
    }

    async getRemainingHolidays(employee: EmployeeInterface | Employee): Promise<number>{
        if (Connector.getType() === DatabaseType.MongoDB) {
            let emp = employee as EmployeeInterface;
            return emp.remaining_holidays;
        } else {
            let emp = employee as Employee;
            return emp.remaining_holidays;
        }
    }

    async updateRequest(request: RequestInterface | HolidayRequest, startDate: Date, endDate: Date): Promise<RequestInterface | HolidayRequest | null> {
        if (Connector.getType() == DatabaseType.MongoDB) {
            const req = request as RequestInterface;
            const updatedRequest = await requestWorker.updateRequestById(req._id, {
                start_date: startDate,
                end_date: endDate
            });
            return updatedRequest;
        } else {
            return null;
        }
    }

    async getEmployeeById(id: Types.ObjectId): Promise<EmployeeInterface | null> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await employeeWorker.getById(id);
        } else {
            throw new Error('Employee data retrieval currently only supported in MongoDB');
        }
    }

    async updateEmployeeById(id: Types.ObjectId, newData: Partial<EmployeeInterface>): Promise<EmployeeInterface | null> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await employeeWorker.updateById(id, newData);
        } else {
            throw new Error('Employee data update currently only supported in MongoDB');
        }
    }

    async updateDepartmentById(id: Types.ObjectId, newData: Partial<DepartmentInterface>): Promise<DepartmentInterface | null> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await departmentWorker.updateById(id, newData);
        } else {
            throw new Error('Department data update currently only supported in MongoDB');
        }
    }

    async updateBlackoutPeriodById(id: Types.ObjectId, newData: Partial<BlackoutPeriodInterface>) {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                const holidayId = new Types.ObjectId(id);
                return await blackoutPeriodWorker.updateById(holidayId, newData);
            } else {
                throw new Error('Holiday data update currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error updating holiday:', error);
            throw error; // Re-throw for further handling
        }
    }

    // Methods for data types that can work with both MongoDB and PostgreSQL (if applicable):
    async readAllDepartments(): Promise<DepartmentInterface[]> {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return await departmentWorker.readAllDepartments();
            } else if (Connector.getType() === DatabaseType.PostgreSQL) {
                // Implement logic for reading all departments in PostgreSQL
            } else {
                throw new Error('Unsupported database type');
            }
        } catch (error) {
            console.error('Error reading departments:', error);
            throw error; // Re-throw for further handling
        }
		return [];
    }

    async getRequestById(id: Types.ObjectId | string): Promise<RequestInterface | null> {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return await requestWorker.getRequestById(id as Types.ObjectId);
            } else {
                throw new Error('Request retrieval currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error retrieving request:', error);
            throw error; // Re-throw for further handling
        }
    }

    async getDepartment(employee: EmployeeInterface | Employee): Promise<Department | Partial<DepartmentInterface> | null> {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                return await departmentWorker.getDepartment(employee.department as Types.ObjectId);
            } else {
                return {} as Department;
                throw new Error('Request retrieval currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error retrieving request:', error);
            throw error; // Re-throw for further handling
        }
    }

    async getHolidayDetails(id: string): Promise<BlackoutPeriod | null> {
        if (Connector.getType() === DatabaseType.PostgreSQL) {
            // Implement logic for retrieving holiday details in PostgreSQL
			return null;
        } else {
            throw new Error('Holiday data retrieval currently only supported in PostgreSQL');
        }
    }

    async getEmployeesFromObject() {
        const employees = getEmployees();
        for (let employee of employees) {
            employeeWorker.insertOne(employee);
        }
	}

    async getDepartmentsFromObject() {
        departmentWorker.insertFromObject(holidayRulesByDepartment);
    }

    async getHolidaysFromObject() {
        
    }

	async getEmployees(): Promise<EmployeeInterface[]> {
		try {
		  const employees = await EmployeeModel.find();
		  return employees; // Ensure explicit typing
		} catch (error) {
		  console.error('Error reading employees:', error);
		  throw error; // Re-throw for further handling
		}
	}
}

export const dbWorker = new DBWorker();
