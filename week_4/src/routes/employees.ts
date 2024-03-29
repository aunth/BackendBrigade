
import express, { Request, Response } from 'express';
import { dbHandler } from '../database_integration/DataBaseWorker';
import { authenticationMiddleware } from '../config/passportConfig';


const router = express.Router();

router.get('/', authenticationMiddleware, async(req: Request, res: Response) => {
    const employeeName = req.body.name;
    if (employeeName) {
        const employeeId = await dbHandler.getEmployeeIdByName(employeeName);
        const employees =  [await dbHandler.getEmployeeById(employeeId)];
        const holidayRequests = await dbHandler.getRequests();
        return res.render('employees', {employees, holidayRequests});
    }
    const employees =  await dbHandler.getEmployees();
    const holidayRequests = await dbHandler.getRequests();
    res.render('employees', {employees, holidayRequests});
});


export default router;
