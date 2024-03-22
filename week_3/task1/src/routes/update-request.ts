import express, {Response, Request} from 'express';
import { HolidayRequest} from '../types/types';
//import { getEmployees, getHolidayRequests, updateHolidayRequest} from '../utils/dataManager';
import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { findEmploee } from '../utils/utils';

import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';

const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const employeeId = req.query.employeeId as string;
    const publicHolidays = await getPublicHolidays(employeeId);
    const holidayRequests: HolidayRequest[] = await (await requestController.getAllRequests()).filter(request => request.employee_id.toString() === employeeId && request.status === "pending");
    res.render('update-request', {error: error, publicHolidays: publicHolidays, holidayRequests: holidayRequests, employeeId: employeeId});
});

router.put('/', async(req: Request, res: Response) => {
    const { idForRequest, employeeId, startDate, endDate } = req.body;
    const requestID = Number(idForRequest);
    
    
    if (!employeeId || !startDate || !endDate || !idForRequest) {
        return res.json({success: true, redirectUrl: `/update-request?error=Invalid input&employeeId=${employeeId}`});
    }

    let holidayRequests: HolidayRequest[] = await requestController.getAllRequests();
    const requestIndex = holidayRequests.findIndex(request => request.id === requestID);
    let employees = await employeeController.getEmployees();
    const employee = findEmploee(employees, Number(employeeId));

    if (!employee){
        return res.json({success: true, redirectUrl: `/update-request?error=Employee not found&employeeId=${employeeId}`});
    }

    if (requestIndex === -1) {
        return res.json({success: true, redirectUrl: `/update-request?error=Request not found&employeeId=${employeeId}`});
    }

    const validationError = await validateRequestDates(startDate, endDate, employee);
    if (validationError) {
        return res.json({success: true, redirectUrl: `/update-request?error=${encodeURIComponent(validationError)}&employeeId=${employeeId}`});
    }

    const holidayConflict = await checkHolidayConflicts(startDate, endDate, employeeId);
    if (holidayConflict) {
        return res.json({success: true, redirectUrl: `/update-request?error=${encodeURIComponent(holidayConflict)}&employeeId=${employeeId}`});
    }

    //Updating the found request
    const updatedRequest: HolidayRequest = {
        ...holidayRequests[requestIndex],
        start_date: new Date(startDate),
        end_date: new Date(endDate)
    }
    if (await isDuplicateRequest(updatedRequest)) {
        return res.json({success: true, redirectUrl: `/update-request?error=Duplicate holiday request detected.&employeeId=${employeeId}`});
      } else {
        await requestController.updateHolidayRequest(String(requestID), updatedRequest);
      }

    console.log(`User with id ${updatedRequest.employee_id} updated their Holiday Request ` + 
                `from ${updatedRequest.start_date.toLocaleDateString('en-CA')} ` + 
                `to ${updatedRequest.end_date.toLocaleDateString('en-CA')}`);


    res.json({ success: true, redirectUrl: '/requests' })
});

export default router;