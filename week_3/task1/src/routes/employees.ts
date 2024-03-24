
import express, { Request, Response } from 'express';
import { dbWorker } from '../database_integration/DataBaseWorker';


const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
    const employees =  await dbWorker.getEmployees();
    const holidayRequests = await dbWorker.getRequests();
    res.render('employees', {employees, holidayRequests});
});

export default router;
