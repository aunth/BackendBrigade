import mongoose, { Schema, Document, Types } from 'mongoose';


export enum Roles {
    ADMIN='admin', 
    EMPLOYEE='employee'
};

export interface EmployeeInterface extends Document {
    _id: Types.ObjectId;
    name: string;
    department_id: Types.ObjectId;
    role: string;
    country: string;
    remaining_holidays: number;
}

export interface RequestInterface extends Document {
    _id: Types.ObjectId;
    employee_id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
    status: string;
}

export interface DepartmentInterface extends Document {
    _id: Types.ObjectId;
    name: string;
    max_consecutive_days: number;
    blackout_periods: Types.ObjectId[];
}

export interface BlackoutPeriodInterface extends Document {
    _id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
}

export interface CredentialInterface extends Document {
    _id: Types.ObjectId;
    employee_id: Types.ObjectId;
    email: string;
    password: string;
    two_fa_code: string | null;
}

export const CredentialSchema = new Schema({
    _id: {type: Types.ObjectId, require: true},
    employee_id: { type: Types.ObjectId, ref: 'Employees', required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    two_fa_code: {type: String, required: false},
}, {collection: 'Credentials'})

export const RequestSchema = new Schema({
	_id: {type: Types.ObjectId, required: true},
    employee_id: { type: Types.ObjectId, ref: 'Employees', required: true },
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    status: { type: String, required: true },
}, { collection: 'Requests' });

export const EmployeeSchema = new Schema({
    _id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    department_id: { type: Types.ObjectId, ref: 'Departments', required: true },
    role: { type: String, required: true},
    country: { type: String, required: true },
    remaining_holidays: { type: Number, required: true }
}, { collection: 'Employees' });


export const DepartmentSchema = new Schema({
    _id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    max_consecutive_days: { type: Number, required: true },
    blackout_periods: { type: [Types.ObjectId], ref: 'BlackoutPeriods', required: true }
}, { collection: 'Departments' });

const BlackoutPeriodSchema = new Schema({
    _id: { type: Types.ObjectId, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
}, { collection: 'BlackoutPeriods' });

export const DepartmentModel = mongoose.model<DepartmentInterface>('Departments', DepartmentSchema);
export const EmployeeModel = mongoose.model<EmployeeInterface>('Employees', EmployeeSchema);
export const CredentialModel = mongoose.model<CredentialInterface>('Credentials', CredentialSchema);
export const RequestModel = mongoose.model<RequestInterface>('Requests', RequestSchema);
export const BlackoutPeriodModel = mongoose.model<BlackoutPeriodInterface>('BlackoutPeriods', BlackoutPeriodSchema);
