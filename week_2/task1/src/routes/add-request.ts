import express, {Response, Request} from 'express';
<<<<<<< HEAD
import { holidayRulesByDepartment} from '../../data/dataStore';
import { HolidayRequest, Employee, Holiday } from '../types/types';
import { getEmployees, getHolidayRequests, saveHolidayRequests, getNextPublicHolidays, getCountryById } from '../utils/utils';
import { error } from 'console';

=======
import { HolidayRequest} from '../types/types';
import { getEmployees, getHolidayRequests, saveHolidayRequest} from '../utils/dataManager';
import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { findEmploee } from '../utils/utils';
>>>>>>> 6aa8373927e717bdfad656e385819d9df56fbc6c

const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const employeeId = req.query.employeeId as string
    const publicHolidays = await getPublicHolidays(employeeId);
    res.render('add-request', {error: error, publicHolidays: publicHolidays, employeeId: employeeId});
});

router.post('/',  async(req: Request, res: Response) => {

    const {employeeId, startDate, endDate} = req.body;
<<<<<<< HEAD
    const empId = Number(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const countryCode = getCountryById(empId);
    const publicHolidays = await getNextPublicHolidays(countryCode);    

=======
   
    
>>>>>>> 6aa8373927e717bdfad656e385819d9df56fbc6c
    if (!employeeId || !startDate || !endDate) {
        return res.redirect(`add-request?error=Invalid input&employeeId=${employeeId}`);
    }

    let employees = getEmployees();
    let holidayRequests = getHolidayRequests();
    

    const employee = findEmploee(employees, Number(employeeId));
    if (!employee){
        return res.redirect(`/add-request?error=Employee not found&employeeId=${employeeId}`);
    }

<<<<<<< HEAD

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
=======
    const validationError = validateRequestDates(startDate, endDate, employee);
    if (validationError) {
        return res.redirect(`/add-request?error=${encodeURIComponent(validationError)}&employeeId=${employeeId}`);
    }

    // Check for conflicts with public holidays

    const holidayConflict = await checkHolidayConflicts(startDate, endDate, employeeId);
    if (holidayConflict) {
        return res.redirect(`/add-request?error=${encodeURIComponent(holidayConflict)}&employeeId=${employeeId}`);
>>>>>>> 6aa8373927e717bdfad656e385819d9df56fbc6c
    }


    const newRequest: HolidayRequest = {
<<<<<<< HEAD
        idForRequest: holidayRequests.reduce((max, request) => Math.max(max, request.idForRequest), 0) + 1,
        employeeId: empId,
        startDate: start,
        endDate: end,
=======
        idForRequest: holidayRequests.length + 1,
        employeeId: Number(employeeId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
>>>>>>> 6aa8373927e717bdfad656e385819d9df56fbc6c
        status: 'pending',
    };

    if (isDuplicateRequest(newRequest)) {
        return res.redirect(`/add-request?error=Duplicate holiday request detected.&employeeId=${employeeId}`);
      } else {
        saveHolidayRequest(newRequest);
      }

    console.log(`User with ${newRequest.employeeId} id create new Holiday Request ` + 
                `from ${newRequest.startDate.toLocaleDateString('en-CA')} ` + 
                `to ${newRequest.endDate.toLocaleDateString('en-CA')}`)

<<<<<<< HEAD
    holidayRequests.push(newRequest);
    saveHolidayRequests(holidayRequests);

    res.redirect('/requests');
=======
    res.redirect('/holidays');
>>>>>>> 6aa8373927e717bdfad656e385819d9df56fbc6c

});


export default router;