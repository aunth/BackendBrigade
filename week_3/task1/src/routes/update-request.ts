import express, {Response, Request} from 'express';
import { HolidayRequest} from '../types/types';
//import { getEmployees, getHolidayRequests, updateHolidayRequest} from '../utils/dataManager';
import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { findEmploee } from '../utils/utils';

import { dbWorker } from '../database_integration/DataBaseWorker';
import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';

const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const employeeName = req.query.employeeName as string;
    const employeeId = await dbWorker.getEmployeeIdByName(employeeName);
    if (employeeId == undefined) {
        console.log(`Cannot find id for employee with name ${employeeName}`);
    } else {
        const publicHolidays = await getPublicHolidays(employeeId);
        const holidayRequests = await dbWorker.getHolidayRequestsByEmployeeId(employeeId);
        res.render('update-request', {error: error, publicHolidays: publicHolidays, holidayRequests: holidayRequests, employeeId: employeeId});
    }
});

router.put('/', async(req: Request, res: Response) => {
    const { idForRequest, employeeId, startDate, endDate } = req.body;
    const requestID = idForRequest;
    
    
    if (!employeeId || !startDate || !endDate || !idForRequest) {
        return res.json({success: true, redirectUrl: `/update-request?error=Invalid input&employeeId=${employeeId}`});
    }

    // let holidayRequests: HolidayRequest[] = await requestController.getAllRequests();
    // const requestIndex = holidayRequests.findIndex(request => request.id === requestID);
    const holidayRequest = await dbWorker.getRequestById(requestID);
    const employee = await dbWorker.getEmployeeById(employeeId);

    if (!employee){
        return res.json({success: true, redirectUrl: `/update-request?error=Employee not found&employeeId=${employeeId}`});
    }

    if (!holidayRequest) {
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


    const updatedRequest = await dbWorker.updateRequest(requestID, {
        start_date: startDate, end_date: endDate });
    if (updatedRequest == null) {
        console.log(`Something went wrong with updating request ${holidayRequest}`);
        return ;
    }
    if (await isDuplicateRequest(updatedRequest)) {
        return res.json({success: true, redirectUrl: `/update-request?error=Duplicate holiday request detected.&employeeId=${employeeId}`});
      } else {
        await dbWorker.updateRequest(requestID, updatedRequest);
      }

    console.log(`User with id ${updatedRequest.employee_id} updated their Holiday Request ` + 
                `from ${updatedRequest.start_date.toLocaleDateString('en-CA')} ` + 
                `to ${updatedRequest.end_date.toLocaleDateString('en-CA')}`);


    res.json({ success: true, redirectUrl: '/requests' })
});

export default router;