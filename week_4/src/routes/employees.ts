
import express, { Request, Response } from 'express';
import { dbHandler } from '../database_integration/DataBaseWorker';


const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
    const employees =  await dbHandler.getEmployees();
    const holidayRequests = await dbHandler.getRequests();
    res.render('employees', {employees, holidayRequests});
});

export default router;
