

import { employees, holidayRequests } from '../../data/dataStore'
import express, { Request, Response } from 'express';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.render('employees', {employees, holidayRequests});
});

export default router;
