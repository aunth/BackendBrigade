
import express, { Request, Response } from 'express';
<<<<<<< HEAD
import { dbHandler } from '../database_integration/DataBaseWorker';
=======
import { dbWorker } from '../database_integration/DataBaseWorker';
import { authenticationMiddleware } from '../config/passportConfig';
>>>>>>> 106e7bad2a44130ce8bc2fc7ef16de6180f7dfce


const router = express.Router();

<<<<<<< HEAD
router.get('/', async(req: Request, res: Response) => {
    const employees =  await dbHandler.getEmployees();
    const holidayRequests = await dbHandler.getRequests();
=======
router.get('/', authenticationMiddleware, async(req: Request, res: Response) => {
    const employees =  await dbWorker.getEmployees();
    const holidayRequests = await dbWorker.getRequests();
>>>>>>> 106e7bad2a44130ce8bc2fc7ef16de6180f7dfce
    res.render('employees', {employees, holidayRequests});
});


export default router;
