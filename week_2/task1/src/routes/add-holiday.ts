import express, {Response, Request} from 'express';
import { holidayRulesByDepartment } from '../../data/dataStore';
import { HolidayRequest } from '../types/types';
import { getEmployees, getHolidayRequests } from '../utils/utils';


const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.render('add-holiday');
});

router.post('/', (req: Request, res: Response) => {
    const {employeeId, startDate, endDate} = req.body;
    const empId = Number(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!employeeId || !startDate || !endDate) {
        return res.redirect('add-holiday?error=Invalid input');
    }

    let employees = getEmployees();
    let holidayRequests = getHolidayRequests();
    

    const employee = employees.find(emp => emp.id === empId)
    if (!employee){
        return res.redirect('/add-holiday?error=Employee not found');
    }

    if (start > end) {
        return res.redirect('/add-holiday?error=Start date must be before end date');
    }

    const dayDifference = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (dayDifference > holidayRulesByDepartment[employee.department].maxConsecutiveDays) {
        return res.redirect('/add-holiday?error=Exceeds maximum consecutive holiday days');
    } else if (employee.remainingHolidays < dayDifference) {
        return res.redirect('/add-holiday?error=Insufficient remaining holiday days');
    }

    // Check for blackout periods
    const inBlackoutPeriod = holidayRulesByDepartment[employee.department].blackoutPeriods.some(period => {
        const blackoutStart = new Date(period.start);
        const blackoutEnd = new Date(period.end);
        return (start <= blackoutEnd && start >= blackoutStart) || (end <= blackoutEnd && end >= blackoutStart);
    });

    if (inBlackoutPeriod) {
        return res.redirect('/add-holiday?error=Request falls within a blackout period');
    }

    const newRequest: HolidayRequest = {
        idForRequest: holidayRequests.length + 1,
        employeeId: empId,
        startDate: start,
        endDate: end,
        status: 'pending',
    };

    console.log(`User with ${newRequest.employeeId} id create new Holiday Request ` + 
                `from ${newRequest.startDate.toLocaleDateString('en-CA')} ` + 
                `to ${newRequest.endDate.toLocaleDateString('en-CA')}`)

    holidayRequests.push(newRequest);

    res.redirect('/holidays');

});


export default router;