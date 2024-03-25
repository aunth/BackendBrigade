import { EmployeeModel, EmployeeInterface } from './models';
import { Employee } from '../types/types';
import { Types } from 'mongoose';


class EmployeesWorker {

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
	  throw error;
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
      return employee;
    } catch (error) {
      console.error('Error reading employee:', error);
      throw error;
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
