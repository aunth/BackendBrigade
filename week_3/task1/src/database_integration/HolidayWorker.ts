
import mongoose, { FilterQuery } from 'mongoose';
import { BlackoutPeriodModel, BlackoutPeriodInterface } from './models';
import { DepartmentValues, HolidayRequest, HolidayRule } from './../types/types';
import { Types } from 'mongoose';

class BlackoutPeriodWorker {
	
	async insertOneBlackoutPeriod(holidayData: any) {
		try {
			const newHoliday = new BlackoutPeriodModel(holidayData);
			await newHoliday.save();
			console.log('Holiday inserted successfully!');
			return newHoliday;
		} catch (error) {
			console.error('Error inserting holiday:', error);
	}
	}

  async updateById(holidayId: Types.ObjectId, updatedData: Partial<BlackoutPeriodInterface>) {
	try {
		const updatedHoliday = await BlackoutPeriodModel.findByIdAndUpdate(holidayId, updatedData, {
		new: true,
		});
		console.log('Holiday updated successfully!', updatedHoliday);
		return updatedHoliday;
	}catch (error) {
		console.error('Error updating holiday:', error);
		return ;
	}
  }

  async deleteOneBlackoutPeriod(holidayId: Types.ObjectId) {
	try {
		await BlackoutPeriodModel.findByIdAndDelete(holidayId);
		console.log('Holiday deleted successfully!');
	} catch (error) {
		console.error('Error deleting holiday:', error);
	}
  }

  async findBlackoutPeriod(filter: FilterQuery<BlackoutPeriodInterface>={}): Promise<BlackoutPeriodInterface[]> {
	try {
		const holidays = await BlackoutPeriodModel.find(filter);
		return holidays;
	} catch (error) {
		console.error('Error finding holidays:', error);
		return []; // Handle or throw error as needed
	}
  }
}

export const blackoutPeriodWorker = new BlackoutPeriodWorker();
