
import mongoose, { FilterQuery } from 'mongoose';
import { HolidayModel, Holiday } from './models';
import { DepartmentValues, HolidayRequest, HolidayRule } from './../types/types';
import { Types } from 'mongoose';

class HolidayWorker {
	
	async insertOneHoliday(holidayData: any) {
		try {
			const newHoliday = new HolidayModel(holidayData);
			await newHoliday.save();
			console.log('Holiday inserted successfully!');
			return newHoliday;
		} catch (error) {
			console.error('Error inserting holiday:', error);
	}
	}

  async updateById(holidayId: Types.ObjectId, updatedData: Partial<Holiday>) {
	try {
		const updatedHoliday = await HolidayModel.findByIdAndUpdate(holidayId, updatedData, {
		new: true,
		});
		console.log('Holiday updated successfully!', updatedHoliday);
		return updatedHoliday;
	}catch (error) {
		console.error('Error updating holiday:', error);
		return ;
	}
  }

  async deleteOneHoliday(holidayId: Types.ObjectId) {
	try {
		await HolidayModel.findByIdAndDelete(holidayId);
		console.log('Holiday deleted successfully!');
	} catch (error) {
		console.error('Error deleting holiday:', error);
	}
  }

  async findHolidays(filter: FilterQuery<Holiday>={}): Promise<Holiday[]> {
	try {
		const holidays = await HolidayModel.find(filter);
		return holidays;
	} catch (error) {
		console.error('Error finding holidays:', error);
		return []; // Handle or throw error as needed
	}
  }
}

export const holidayWorker = new HolidayWorker();
