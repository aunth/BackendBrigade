import express, {Response, Request} from 'express';
import { holidayRulesByDepartment } from '../../data/dataStore';
import { HolidayRequest } from '../types/types';
import { getEmployees, getHolidayRequests, getNextPublicHolidays } from '../utils/utils';
import { error } from 'console';
import { renameSync } from 'fs';


const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const countryCode = "UA"
    const holidays = await getNextPublicHolidays(countryCode);
    const holidayRequests: HolidayRequest[] = getHolidayRequests();
    res.render('update-request', {error: error, holidays: holidays, holidayRequests: holidayRequests})
});

router.put('/', (req: Request, res: Response) => {
    const {employeeId, startDate, endDate} = req.body;
    const empId = Number(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);

    res.redirect('/holidays');
});

export default router;