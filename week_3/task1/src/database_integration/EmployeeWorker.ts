import mongoose, { Document, Model } from 'mongoose';
import { EmployeeModel, EmployeeInterface } from './models';
import { Employee } from '../types/types';
import { departmentWorker } from './DepartmentWorker';
import { Types } from 'mongoose';
import { blackoutPeriodWorker } from './HolidayWorker';
import { requestWorker } from './RequestWorker';
import { dbWorker } from './DataBaseWorker';


class EmployeesWorker {

//   async insertOne(employee: EmployeeInterface): Promise<EmployeeInterface> {
// 	try {
// 		const holidayRequests = await dbWorker.getHolidayRequestsByEmployee(employee._id);
// 		if (holidayRequests.length == 0) {
// 			console.log(`Employee with ${employee.id} id has no requests`);
// 		} 
// 		const department = await departmentWorker.getDepartment(employee.department)
// 		console.log(department);

// 		if (!department) {
// 			console.log(`User with name ${employee.name} doens't have a department`);
// 		}

// 		const newEmployee = new EmployeeModel({
// 			_id: new Types.ObjectId(),
// 			name: employee.name,
// 			department: department?._id,
// 			country: employee.country,
// 			remaining_holidays: employee.remaining_holidays,
// 		});

// 		for (let i = 0; i < holidayRequests.length; i++) {
// 			const object = holidayRequests[i];
// 			requestWorker.createRequest({
// 				_id: new Types.ObjectId(),
// 				employee_id: newEmployee._id,
// 				start_date: object.start_date,
// 				end_date: object.end_date,
// 				status: object.status,
// 			})
// 		}

// 		const savedEmployee = await newEmployee.save();
// 		console.log(`Employee ${employee.name} saved successfully.`);
// 		return savedEmployee;
// 	} catch (error) {
// 	  console.error('Error inserting employee:', error);
// 	  throw error;
// 	}
//   }

	async insertEmployee(employeeData: EmployeeInterface): Promise<EmployeeInterface> {
    	try {
    	    // Create a new document using the provided employeeData
    	    const newEmployee = new EmployeeModel(employeeData);

    	    // Save the new document to the database
    	    const savedEmployee = await newEmployee.save();

    	    // Return the saved document
    	    return savedEmployee;
    	} catch (error) {
    	    // Handle any errors that occur during insertion
    	    console.error('Error inserting employee:', error);
    	    throw error;
    	}
	}

  async getByName(name: string): Promise<EmployeeInterface | null> {
	try {
		const employee = await EmployeeModel.findOne({ name });
		return employee;
	} catch (error) {
		console.error('Error getting employee by name:', error);
		throw error;
	}
}

  async insertMany(data: Employee[]): Promise<Employee[]> {
	try {
	  const savedEmployees = await EmployeeModel.insertMany(data);
	  console.log('Employees saved successfully.');
	  return savedEmployees;
	} catch (error) {
	  console.error('Error inserting employees:', error);
	  throw error; // Re-throw the error for further handling
	}
  }

  async updateById(employeeId: Types.ObjectId, data: Partial<EmployeeInterface>): Promise<EmployeeInterface | null> {
	try {
	  const updatedEmployee = await EmployeeModel.findByIdAndUpdate(employeeId, data, { new: true });

	  if (updatedEmployee) {
		console.log(`Employee ${updatedEmployee.name} updated successfully.`);
		return updatedEmployee as EmployeeInterface;
	  } else {
		console.warn(`Employee with ID ${employeeId} not found.`);
		return null;
	  }
	} catch (error) {
	  console.error('Error updating employee:', error);
	  throw error;
	}
  }

  async getById(_id: Types.ObjectId): Promise<EmployeeInterface | null> {
    try {
      const employee = await EmployeeModel.findById(_id);
      return employee; // Ensure explicit typing
    } catch (error) {
      console.error('Error reading employee:', error);
      throw error; // Re-throw for further handling
    }
  }

  async deleteEmployee(employeeId: string): Promise<EmployeeInterface | null> {
	try {
	  const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);

	  if (deletedEmployee) {
		console.log(`Employee ${deletedEmployee.name} deleted successfully.`);
		return deletedEmployee as EmployeeInterface;
	  } else {
		console.warn(`Employee with ID ${employeeId} not found.`);
		return null;
	  }
	} catch (error) {
	  console.error('Error deleting employee:', error);
	  throw error;
	}
  }
}

export const employeeWorker = new EmployeesWorker();
