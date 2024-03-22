import mongoose, { Document, Model } from 'mongoose';
import { EmployeeModel, EmployeeInterface } from './models';
import { Employee } from '../types/types';
import { departmentWorker } from './DepartmentWorker';
import { Types } from 'mongoose';
import { getHolidayRequests } from '../utils/dataManager';
import { holidayWorker } from './HolidayWorker';
import { requestWorker } from './RequestWorker';


class EmployeesWorker {

  async insertOne(data: Employee): Promise<EmployeeInterface> {
	try {
		const holidayObjects = [];
		const status = []
		const holidayRequests = getHolidayRequests(data.id);
		if (holidayRequests.length == 0) {
			console.log(`Employee with ${data.id} id has no requests`);
		} else {
			for (let holidayRequest of holidayRequests) {
				holidayObjects.push(await holidayWorker.insertOneHoliday({
					_id: new Types.ObjectId(),
					startDate: holidayRequest.startDate,
					endDate: holidayRequest.endDate,
				}));
				status.push(holidayRequest.status);
			}
		}
		const department = await departmentWorker.findDepartmentByName(data.department);
		console.log(department);

		if (!department) {
			console.log(`User with name ${data.name} doens't have a department`);
		}

		const newEmployee = new EmployeeModel({
			_id: new Types.ObjectId(),
			name: data.name,
			department: department?._id,
			country: data.country,
			remainingHolidays: data.remainingHolidays,
		});

		for (let i = 0; i < holidayObjects.length; i++) {
			const object = holidayObjects[i];
			requestWorker.createRequest({
				_id: new Types.ObjectId(),
				employeeId: newEmployee._id,
				holiday: object?._id,
				status: status[i],
			})
		}

		const savedEmployee = await newEmployee.save();
		console.log(`Employee ${data.name} saved successfully.`);
		return savedEmployee;
	} catch (error) {
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
