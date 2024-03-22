
import { Employee, HolidayRequest } from '../types/types';
//import { getEmployees, getHolidayRequests } from '../utils/dataManager';
import express, { Request, Response } from 'express';
import { employeeController } from "../controllers/employee.controller";
import { requestController } from "../controllers/request.controller";


const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
    const employees: Employee[] =  await employeeController.getEmployees();
    const holidayRequests: HolidayRequest[] = await requestController.getAllRequests();
    res.render('employees', {employees, holidayRequests});
});

export default router;
