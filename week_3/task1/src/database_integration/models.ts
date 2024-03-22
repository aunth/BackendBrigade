import mongoose, { Schema, Document, Types } from 'mongoose';

export interface EmployeeInterface extends Document {
    _id: Types.ObjectId;
    name: string;
    department: Types.ObjectId;
    country: string;
    remainingHolidays: number;
}

export interface RequestInterface extends Document {
    _id: Types.ObjectId;
    employeeId: Types.ObjectId;
    holiday: Types.ObjectId;
    status: string;
}

export interface Department extends Document {
    _id: Types.ObjectId;
    name: string;
    maxConsecutiveDays: number;
    blackoutPeriods: Types.ObjectId[];
}

export interface Holiday extends Document {
    _id: Types.ObjectId;
    startDate: Date;
    endDate: Date;
}

export const RequestSchema = new Schema({
	_id: {type: Types.ObjectId, required: true},
    employeeId: { type: Types.ObjectId, ref: 'Employee', required: true },
    holiday: { type: Types.ObjectId, ref: 'Holiday', required: true },
    status: { type: String, required: true },
}, { collection: 'Requests' });

export const EmployeeSchema = new Schema({
    _id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    department: { type: Types.ObjectId, ref: 'Department', required: true },
    country: { type: String, required: true },
    remainingHolidays: { type: Number, required: true }
}, { collection: 'Employees' });

export const DepartmentSchema = new Schema({
    _id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    maxConsecutiveDays: { type: Number, required: true },
    blackoutPeriods: { type: [Types.ObjectId], ref: 'Holiday', required: true }
}, { collection: 'Departments' });

const holidaySchema = new Schema({
    _id: { type: Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { collection: 'Holidays' });

export const DepartmentModel = mongoose.model<Department>('Departments', DepartmentSchema);
export const EmployeeModel = mongoose.model<EmployeeInterface>('Employees', EmployeeSchema);
export const RequestModel = mongoose.model<Request>('Requests', RequestSchema);
export const HolidayModel = mongoose.model<Holiday>('Holidays', holidaySchema);
