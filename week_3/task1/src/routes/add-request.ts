import express, {Response, Request} from 'express';
import { HolidayRequest} from '../types/types';
import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { findEmploee } from '../utils/utils';
import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { Types } from 'mongoose';
import { RequestInterface } from '../database_integration/models';
import { createRequestObject } from '../utils/holidayManager';


const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const employeeId = req.query.employeeId;
    if (employeeId == undefined) {
        console.log('EmployeeId didn\'t passed as a parametre');
        return res.render('/');
    }
    const publicHolidays = await getPublicHolidays(employeeId as any);
    res.render('add-request', {error: error, publicHolidays: publicHolidays, employeeId: employeeId});
});

router.post('/',  async(req: Request, res: Response) => {
    
    let {employeeId, startDate, endDate} = req.body;
    
    if (!employeeId || !startDate || !endDate) {
        return res.redirect(`add-request?error=Invalid input&employeeId=${employeeId}`);
    }


    let empId
    try {
        empId = parseInt(employeeId, 10);
    } catch {
        empId = new Types.ObjectId(String(employeeId));
    }
  
    console.log("employeeId", employeeId);
    const employee = await dbWorker.getEmployeeById(employeeId);
    if (!employee){
        return res.redirect(`/add-request?error=Employee not found&employeeId=${employeeId}`);
    }

    const validationError = await validateRequestDates(startDate, endDate, employee);
    if (validationError) {
        return res.redirect(`/add-request?error=${encodeURIComponent(validationError)}&employeeId=${employeeId}`);
    }

    const holidayConflict = await checkHolidayConflicts(startDate, endDate, employeeId);
    if (holidayConflict) {
        return res.redirect(`/add-request?error=${encodeURIComponent(holidayConflict)}&employeeId=${employeeId}`);
    }
    
    try {
        const newRequest = await createRequestObject(employeeId, startDate, endDate);
        
        const isDuplicate = await isDuplicateRequest(newRequest);


        if (isDuplicate) {
            return res.redirect(`/add-request?error=Duplicate holiday request detected.&employeeId=${employeeId}`);
          } else {
            await dbWorker.createRequest(newRequest)
          }

        console.log(`User with ${newRequest.employee_id} id create new Holiday Request ` + 
                    `from ${newRequest.start_date.toLocaleDateString('en-CA')} ` + 
                    `to ${newRequest.end_date.toLocaleDateString('en-CA')}`)

        res.redirect('/requests');
    } catch (error) {
        console.error(error);
        return res.redirect(`/add-request?error=Some error in add-request &employeeId=${employeeId}`);
    }

});


export default router;