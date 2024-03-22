import mongoose, { Document, Model } from 'mongoose';
import { EmployeeModel, EmployeeInterface } from './models';
import { Employee } from '../types/types';
import { departmentWorker } from './DepartmentWorker';
import { Types } from 'mongoose';


class EmployeesWorker {
  async insertOne(data: Employee): Promise<EmployeeInterface> {
	try {

		const department = await departmentWorker.findDepartmentByName(data.department);
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
		const savedEmployee = await newEmployee.save();
		console.log(`Employee ${data.name} saved successfully.`);
		return savedEmployee;
	} catch (error) {
	  console.error('Error inserting employee:', error);
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

  async readEmployeeById(id: Types.ObjectId): Promise<EmployeeInterface | null> {
    try {
      const employee = await EmployeeModel.findById(id);
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

  async readEmployee(employeeId: string): Promise<EmployeeInterface | null> {
	try {
	  const employee = await EmployeeModel.findById(employeeId);
	  return employee as EmployeeInterface;
	} catch (error) {
	  console.error('Error reading employee:', error);
	  return null;
	}
  }
}

export const employeeWorker = new EmployeesWorker();
