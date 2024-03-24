
import { Employee, HolidayRequest } from '../types/types';
import express, { Request, Response } from 'express';
import { employeeController } from "../controllers/employee.controller";
import { requestController } from "../controllers/request.controller";
import { dbWorker } from '../database_integration/DataBaseWorker';
import { EmployeeInterface, RequestInterface } from '../database_integration/models';

const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
    const employees =  await dbWorker.getEmployees();
    const holidayRequests = await dbWorker.getRequests();
    res.render('employees', {employees, holidayRequests});
});

export default router;
