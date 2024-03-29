
import { Employee, HolidayRequest} from '../types/types';
import { getEmployees } from './dataManager';
import { EmployeeInterface, RequestInterface } from '../database_integration/models';
import { DatabaseType, dbConnector } from '../database_integration/db';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { Types } from 'mongoose';
import nodemailer from 'nodemailer'

import dotenv from 'dotenv';
dotenv.config();

export const employeesFilename = './data/employees.json';
export const holidaysFilename = './data/holidays.json';


export function increaseUserHolidays(employeeId: number, daysNum: number) {
  const employees: Employee[] = getEmployees();
  const user = employees.find(employee => employee.id === employeeId);

  if (user) {
    user.remaining_holidays += daysNum;
  }
  return employees;
}

export function getDaysNum(request: HolidayRequest | RequestInterface) {
  const endDate = new Date(request.end_date);
  const startDate = new Date(request.start_date);

  return (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1
}

export async function getEmployeeId(employee: EmployeeInterface | Employee) {
  if (dbConnector.currentDatabaseType == DatabaseType.MongoDB) {
    return (employee as EmployeeInterface)._id;
  } else {
    return employee.id;
  }
}

export async function getNameById(id: number | Types.ObjectId): Promise<string | undefined> {
  const employee = await dbWorker.getEmployeeById(id);
  
  if (!employee) {
      return undefined;
  }
  return employee.name;
}

export async function getCountryById(id: number | Types.ObjectId): Promise<string> {
  const employee = await dbWorker.getEmployeeById(id)
  return employee ? employee.country : "";
}

export function findEmploee(employees: Employee[], empId: number){
  return employees.find(emp => emp.id === empId);
}


function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function send2FACode(email: string, code: string) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
  });

  let info = await transporter.sendMail({
      from: '"BACKEND_BRIGADE SECURITY SERVICE" wwg.backend.brigade@gmail.com',
      to: email,
      subject: 'Your 2FA Code',
      text: `Your 2FA code is: ${code}`,
      html: `<b>Your 2FA code is: ${code}</b>`
  });

  console.log('Message sent: %s', info.messageId);
  return { status: true, message: "2FA code sent successfully!" };
}


export async function handle2FACodeRequest(email: string) {
  const code = generate2FACode();
  let isCodeSave = await dbWorker.save2FACode(email, code)
  if (isCodeSave) {
    return await send2FACode(email, code);
  } else {
    return { status: false, message: "2FA code already exists." };
  }
}
