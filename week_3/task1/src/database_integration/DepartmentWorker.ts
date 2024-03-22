import mongoose, { Document, Model } from 'mongoose';
import { DepartmentModel, Department, HolidayModel, Holiday } from './models'; // Assuming models.ts is in the same directory
import { DepartmentValues, Employee, HolidayRule } from './../types/types';
import { Types } from 'mongoose';
import { employeeWorker } from './EmployeeWorker';


class DepartmentWorker {

	async insertFromObject(holidayRulesByDepartment: { [key in DepartmentValues]: HolidayRule }) {
		const departmentDocs: Department[] = [];
		const holidayDocs: Holiday[] = [];

		let department: DepartmentValues;
  
		for (department in holidayRulesByDepartment) {
			const departmentRules = holidayRulesByDepartment[department] as HolidayRule;

			console.log(departmentRules.blackoutPeriods);

			let newHoliday = new HolidayModel({
				_id: new Types.ObjectId(),
				startDate: departmentRules.blackoutPeriods[0].start,
				endDate: departmentRules.blackoutPeriods[0].end,
			  })
  
			let newDepartment = new DepartmentModel({
				_id: new Types.ObjectId(),
				name: department,
				maxConsecutiveDays: departmentRules.maxConsecutiveDays,
				blackoutPeriods: [newHoliday._id],
			})
  
		departmentDocs.push(newDepartment);
		holidayDocs.push(newHoliday);
		console.log(departmentRules);
		}
  
		try {
			await DepartmentModel.insertMany(departmentDocs);
			console.log('Departments populated successfully!');
		} catch (error) {
			console.error('Error populating departments:', error);
		}

		try {
			await HolidayModel.insertMany(holidayDocs);
			console.log('Holidays populated successfully!');
		  } catch (error) {
			console.error('Error populating holidays:', error);
		  }
}

  async insertDepartment(data: Department): Promise<Department> {
	try {
	  const newDepartment = new DepartmentModel(data);
	  const savedDepartment = await newDepartment.save();
	  console.log(`Department ${data.name} saved successfully.`);
	  return savedDepartment;
	} catch (error) {
	  console.error('Error inserting department:', error);
	  throw error; // Re-throw the error for further handling
	}
  }

  async readAllDepartments(): Promise<Department[]> {
    try {
      const departments = await DepartmentModel.find();
      return departments as Department[]; // Ensure explicit typing
    } catch (error) {
      console.error('Error reading departments:', error);
      throw error; // Re-throw for further handling
    }
  }

  async insertManyDepartments(data: Department[]): Promise<Department[]> {
	try {
	  const savedDepartments = await DepartmentModel.insertMany(data);
	  console.log('Departments saved successfully.');
	  return savedDepartments;
	} catch (error) {
	  console.error('Error inserting departments:', error);
	  throw error; // Re-throw the error for further handling
	}
  }

  async findDepartmentByName(name: string): Promise<Department | null> {
    try {
      const department = await DepartmentModel.findOne({ name });
      return department;
    } catch (error) {
      console.error('Error finding department:', error);
      return null;
    }
  }

  async updateById(departmentId: Types.ObjectId, data: Partial<Department>): Promise<Department | null> {
	try {
	  const updatedDepartment = await DepartmentModel.findByIdAndUpdate(departmentId, data, { new: true });

	  if (updatedDepartment) {
		console.log(`Department ${updatedDepartment.name} updated successfully.`);
		return updatedDepartment as Department; // Ensure explicit typing
	  } else {
		console.warn(`Department with ID ${departmentId} not found.`);
		return null;
	  }
	} catch (error) {
	  console.error('Error updating department:', error);
	  throw error; // Re-throw the error for further handling
	}
  }

  async deleteDepartment(departmentId: Types.ObjectId): Promise<Department | null> {
	try {
	  const deletedDepartment = await DepartmentModel.findByIdAndDelete(departmentId);

	  if (deletedDepartment) {
		console.log(`Department ${deletedDepartment.name} deleted successfully.`);
		return deletedDepartment as Department; // Ensure explicit typing
	  } else {
		console.warn(`Department with ID ${departmentId} not found.`);
		return null;
	  }
	} catch (error) {
	  console.error('Error deleting department:', error);
	  throw error; // Re-throw the error for further handling
	}
  }

  async readDepartment(departmentId: Types.ObjectId): Promise<Department | null> {
	try {
	  const department = await DepartmentModel.findById(departmentId);
	  return department as Department; // Ensure explicit typing
	} catch (error) {
	  console.error('Error reading department:', error);
	  return null;
	}
  }
}

export const departmentWorker = new DepartmentWorker();
