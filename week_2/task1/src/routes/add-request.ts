import express, {Response, Request} from 'express';
import { holidayRulesByDepartment} from '../../data/dataStore';
import { HolidayRequest, Employee, Holiday } from '../types/types';
import { getEmployees, getHolidayRequests, saveHolidayRequests, getNextPublicHolidays, getCountryById } from '../utils/utils';
import { error } from 'console';


const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const employeeId = req.query.employeeId as string
    const countryCode = getCountryById(Number(employeeId));
    const publicHolidays = await getNextPublicHolidays(countryCode);
    res.render('add-request', {error: error, publicHolidays: publicHolidays, employeeId: employeeId});
});

router.post('/',  async(req: Request, res: Response) => {

    const {employeeId, startDate, endDate} = req.body;
    const empId = Number(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const countryCode = getCountryById(empId);
    const publicHolidays = await getNextPublicHolidays(countryCode);    

    if (!employeeId || !startDate || !endDate) {
        return res.redirect(`add-request?error=Invalid input&employeeId=${employeeId}`);
    }

    let employees = getEmployees();
    let holidayRequests = getHolidayRequests();
    

    const employee = employees.find(emp => emp.id === empId)
    if (!employee){
        return res.redirect(`/add-request?error=Employee not found&employeeId=${employeeId}`);
    }


    if (start > end) {
        return res.redirect(`/add-request?error=Start date must be before end date&employeeId=${employeeId}`);
    }

    const dayDifference = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (dayDifference > holidayRulesByDepartment[employee.department].maxConsecutiveDays) {
        return res.redirect(`/add-request?error=Exceeds maximum consecutive holiday days&employeeId=${employeeId}`);
    } else if (employee.remainingHolidays < dayDifference) {
        return res.redirect(`/add-request?error=Insufficient remaining holiday days&employeeId=${employeeId}`);
    }

    // Check for blackout periods
    const inBlackoutPeriod = holidayRulesByDepartment[employee.department].blackoutPeriods.some(period => {
        const blackoutStart = new Date(period.start);
        const blackoutEnd = new Date(period.end);
        return (start <= blackoutEnd && start >= blackoutStart) || (end <= blackoutEnd && end >= blackoutStart);
    });

    if (inBlackoutPeriod) {
        return res.redirect(`/add-request?error=Request falls within a blackout period&employeeId=${employeeId}`);
    }

    // Check for conflicts with public holidays
    const holidayConflict = publicHolidays.filter((holiday: Holiday) => {
        const holidayDate = new Date(holiday.date);
        return start <= holidayDate && holidayDate <= end;
    });


    if (holidayConflict > 0) {
        // Logic to suggest alternative dates goes here
        return res.redirect(`/add-request?error=Request conflicts with a public holiday. Please choose different dates.&employeeId=${employeeId}`);
    }

    const newRequest: HolidayRequest = {
        idForRequest: holidayRequests.reduce((max, request) => Math.max(max, request.idForRequest), 0) + 1,
        employeeId: empId,
        startDate: start,
        endDate: end,
        status: 'pending',
    };

    console.log(`User with ${newRequest.employeeId} id create new Holiday Request ` + 
                `from ${newRequest.startDate.toLocaleDateString('en-CA')} ` + 
                `to ${newRequest.endDate.toLocaleDateString('en-CA')}`)

    holidayRequests.push(newRequest);
    saveHolidayRequests(holidayRequests);

    res.redirect('/requests');

});


export default router;