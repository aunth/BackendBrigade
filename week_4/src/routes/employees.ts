
import express, { Request, Response } from 'express';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { authenticationMiddleware } from '../config/passportConfig';


const router = express.Router();

router.get('/', authenticationMiddleware, async(req: Request, res: Response) => {
    const employees =  await dbWorker.getEmployees();
    const holidayRequests = await dbWorker.getRequests();
    res.render('employees', {employees, holidayRequests});
});


export default router;
