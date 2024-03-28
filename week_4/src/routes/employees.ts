
import express, { Request, Response } from 'express';
import { dbHandler } from '../database_integration/DataBaseWorker';
import { authenticationMiddleware } from '../config/passportConfig';


const router = express.Router();

router.get('/', authenticationMiddleware, async(req: Request, res: Response) => {
    const employees =  await dbHandler.getEmployees();
    const holidayRequests = await dbHandler.getRequests();
    res.render('employees', {employees, holidayRequests});
});


export default router;
