import express, {Response, Request} from 'express';
import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { Types } from 'mongoose';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { DatabaseType, dbConnector } from '../database_integration/db';
import { updateRequestObject } from '../utils/holidayManager';

const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    let employeeId: string | Types.ObjectId | number = req.query.employeeId as string;
    if (dbConnector.currentDatabaseType == DatabaseType.MongoDB) {
        employeeId = new Types.ObjectId(employeeId);
    } else {
        employeeId = Number(employeeId);
    }
    if (employeeId == undefined) {
        console.log(`Cannot find id for employee`);
    } else {
        try {
        const publicHolidays = await getPublicHolidays(employeeId);
        const holidayRequests = await dbWorker.getHolidayRequestsByEmployeeId(employeeId);
    
        if (holidayRequests != null && holidayRequests.length == 0) {
            return res.render('update-request', { 
                error: 'No holiday requests found for this user. Please create a request first.',
                publicHolidays: publicHolidays,
                holidayRequests: holidayRequests,
                employeeId: employeeId
            });
        }
        res.render('update-request', {error: error, publicHolidays: publicHolidays, holidayRequests: holidayRequests, employeeId: employeeId});
        } catch (error) {
            console.log(`Error with getUpdating of the Request: ${error}`);
        }
        
    }
});

router.put('/', async(req: Request, res: Response) => {
    const { idForRequest, employeeId, startDate, endDate } = req.body;

    const requestID = idForRequest;
    
    
    if (!employeeId || !startDate || !endDate || !idForRequest) {
        return res.json({success: true, redirectUrl: `/update-request?error=Invalid input&employeeId=${employeeId}`});
    }

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

    const updatedRequest = await updateRequestObject(employeeId, startDate, endDate);
    

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