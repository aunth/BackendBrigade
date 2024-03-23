import { employeeWorker } from "./EmployeeWorker";
import { holidayWorker } from "./HolidayWorker";
import { departmentWorker } from "./DepartmentWorker";
import { requestWorker } from "./RequestWorker";
import { Employee, DepartmentSQL } from "../types/types";
import { DBConnector, DatabaseType } from "./db";
import { EmployeeInterface, Department, Holiday, EmployeeModel } from "./models";
import { Types } from "mongoose";
import { getEmployees } from "../utils/dataManager";
//import { holidayRulesByDepartment } from "../../data/dataStore";
import { employeeController } from "../controllers/employee.controller"
import { departmentController } from "../controllers/department.controller";
import { blackoutPeriodsController } from "../controllers/blackoutperiods.controller";
import { requestController } from "../controllers/request.controller";
import { uri } from "./db";
import { AppDataSource } from "../database";



export class DBWorker {

    constructor(private dbConnector: DBConnector) {}

    //async writeEmployee(data: Employee): Promise<EmployeeInterface> {
    //    if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
    //        return await employeeWorker.insertOne(data); // Use MongoDB worker
    //    } else {
    //        throw new Error('Employee data currently only supported in MongoDB');
    //    }
    //}

    async getEmployeeByName(name: string): Promise<EmployeeInterface | Employee | null>{
        try {
            if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
                // Assuming `employeeWorker` has a method to retrieve employees by name
                return await employeeWorker.getByName(name);
            } else {
                return await employeeController.getEmployee(name);
                //throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error retrieving employees by name:', error);
            throw error; // Re-throw for further handling
        }
    }


    async getEmployeeIdByEmployeeName(employeeName:string): Promise <string | null> {
        try {
            if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
                return await employeeWorker.getEmployeeIdByName(employeeName);
            } else {
                return await employeeController.getEmployeeIdByName(employeeName);
                //throw new Error('Employee data retrieval by name currently only supported in MongoDB');
            }
        } catch (error) {
            console.error('Error retrieving employees by name:', error);
            throw error;
        }
    }


    // Implement other methods for working with data types supported by MongoDB only:
    async getEmployeeById(id: Types.ObjectId | number): Promise<EmployeeInterface | null | Employee> {
        if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
            return await employeeWorker.getById(id);
        } else {
            return await employeeController.getEmployeeById(id as number)
            //throw new Error('Employee data retrieval currently only supported in MongoDB');
        }
    }

    async updateEmployeeById(id: Types.ObjectId, newData: Partial<EmployeeInterface>): Promise<EmployeeInterface | null> {
        if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
            return await employeeWorker.updateById(id, newData);
        } else {
            throw new Error('Employee data update currently only supported in MongoDB');
        }
    }

    async updateDepartmentById(id: Types.ObjectId, newData: Partial<Department>): Promise<Department | null> {
        if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
            return await departmentWorker.updateById(id, newData);
        } else {
            throw new Error('Department data update currently only supported in MongoDB');
        }
    }

    async updateHolidayById(id: Types.ObjectId, newData: Partial<Holiday>) {
        try {
            if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
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
    async getAllDepartments(): Promise<Department[]> {
        try {
            if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
                return await departmentWorker.readAllDepartments();
            } else if (this.dbConnector.currentDatabaseType === DatabaseType.PostgreSQL) {
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

    //async getDepartmentById(departmentId: Types.ObjectId | number): Promise < Department | DepartmentSQL> {
    //    try {
    //        if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
    //            return await departmentWorker.readDepartment(departmentId);
    //        } else {
    //            return await departmentController.getDepartmentById(departmentId);
    //            //throw new Error('Unsupported database type');
    //        }
    //    } catch (error) {
    //        console.error('Error reading departments:', error);
    //        throw error; // Re-throw for further handling
    //    }
    //}

    async getDepartmentIdByName(departmentName:string){
        try {
            if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
                //return await departmentWorker.readDepartment(departmentId);
            } else {
                return await departmentController.getDepartmentId(departmentName);
                //throw new Error('Unsupported database type');
            }
        } catch (error) {
            console.error('Error reading departments:', error);
            throw error; // Re-throw for further handling
        }
    }

    async getBlackoutPeriodsForDepartment(departmentId:any) { ///////////////
        try {
            if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
                return [];
            } else {
                return await blackoutPeriodsController.getBlackoutPeriods(departmentId);
            }
        } catch (error) {
            console.error('Error reading departments:', error);
            throw error;
        }
    }

    //async getHolidayRequestsByEmployee(employeeId: string) {
    //    if (this.dbConnector.currentDatabaseType === DatabaseType.PostgreSQL) {
    //        // Implement logic for retrieving holiday details in PostgreSQL
	//		return await requestWorker.findRequestsByEmployeeId(employeeId);
    //    } else {
    //        return await requestController.getEmployeeRequests(employeeId);
    //        //throw new Error('Holiday data retrieval currently only supported in PostgreSQL');
    //    }
    //}

    //async getEmployeesFromObject() {
    //    const employees = getEmployees();
    //    for (let employee of employees) {
    //        employeeWorker.insertOne(employee);
    //    }
	//}

    //async getDepartmentsFromObject() {
    //    departmentWorker.insertFromObject(holidayRulesByDepartment);
    //}

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

    //async deleteRequestById(requestId: string){
    //    try {
    //        if (this.dbConnector.currentDatabaseType === DatabaseType.MongoDB) {
    //            return await requestWorker.deleteRequestById(requestId)
    //        } else {
    //            return await requestController.deleteRequest(requestId);
    //            //throw new Error('Holiday data update currently only supported in MongoDB');
    //        }
    //    } catch (error) {
    //        console.error('Error updating holiday:', error);
    //        throw error; // Re-throw for further handling
    //    }
    //}
}

const dbConnectorInstance = DBConnector.getInstance(uri, AppDataSource);
export const dbWorker = new DBWorker(dbConnectorInstance);