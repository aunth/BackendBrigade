import { employeeWorker } from "./EmployeeWorker";
import { holidayWorker } from "./HolidayWorker";
import { departmentWorker } from "./DepartmentWorker";
import { requestWorker } from "./RequestWorker";
import { Employee } from "../types/types";
import { Connector, DBConnector, DatabaseType } from "./db";
import { EmployeeInterface, Department, Holiday, EmployeeModel } from "./models";
import { Types } from "mongoose";


export class DBWorker {

    async writeEmployee(data: Employee): Promise<EmployeeInterface> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await employeeWorker.insertOne(data); // Use MongoDB worker
        } else {
            throw new Error('Employee data currently only supported in MongoDB');
        }
    }

    // Implement other methods for working with data types supported by MongoDB only:
    async getEmployeeById(id: Types.ObjectId): Promise<EmployeeInterface | null> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await employeeWorker.readEmployeeById(id);
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

    async updateDepartmentById(id: Types.ObjectId, newData: Partial<Department>): Promise<Department | null> {
        if (Connector.getType() === DatabaseType.MongoDB) {
            return await departmentWorker.updateById(id, newData);
        } else {
            throw new Error('Department data update currently only supported in MongoDB');
        }
    }

    async updateHolidayById(id: Types.ObjectId, newData: Partial<Holiday>) {
        try {
            if (Connector.getType() === DatabaseType.MongoDB) {
                const holidayId = new Types.ObjectId(id);
                return await holidayWorker.updateById(holidayId, newData);
            } else {
                throw new Error('Holiday data update currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error updating holiday:', error);
            throw error; // Re-throw for further handling
        }
    }

    // Methods for data types that can work with both MongoDB and PostgreSQL (if applicable):
    async readAllDepartments(): Promise<Department[]> {
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

    async getHolidayDetails(id: string): Promise<Holiday | null> {
        if (Connector.getType() === DatabaseType.PostgreSQL) {
            // Implement logic for retrieving holiday details in PostgreSQL
			return null;
        } else {
            throw new Error('Holiday data retrieval currently only supported in PostgreSQL');
        }
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
