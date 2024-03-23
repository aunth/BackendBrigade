import express, {Response, Request} from 'express';
import { HolidayRequest} from '../types/types';
//import { getEmployees, getHolidayRequests, saveHolidayRequest} from '../utils/dataManager';
import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { findEmploee, getIdFromEmployee } from '../utils/utils';
import { Connector, DatabaseType } from '../database_integration/db';
import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { dbWorker } from '../database_integration/DataBaseWorker';


const router = express.Router();


router.get('/', async(req: Request, res: Response) => {
    const error = req.query.error;
    const employeeName = req.query.name as string;
    const employee = (await dbWorker.getEmployeesByName(employeeName));
    if (employee == null) {
        console.log(`There is no employee with name ${name}`);
        res.render(`add-request?error=There is no employee with name ${name}`);
    } else {
        const employeeId = getIdFromEmployee(employee);
        const publicHolidays = await getPublicHolidays(employeeId);
        res.render('add-request', {error: error, publicHolidays: publicHolidays, employeeId: employeeId});
    }

});

router.post('/',  async(req: Request, res: Response) => {

    const {employeeId, startDate, endDate} = req.body;
   
    
    if (!employeeId || !startDate || !endDate) {
        return res.redirect(`add-request?error=Invalid input&employeeId=${employeeId}`);
    }

    let employees = await employeeController.getEmployees();
    let holidayRequests = await requestController.getAllRequests();
    

    const employee = findEmploee(employees, Number(employeeId));
    if (!employee){
        return res.redirect(`/add-request?error=Employee not found&employeeId=${employeeId}`);
    }


    const validationError = await validateRequestDates(startDate, endDate, employee);
    if (validationError) {
        return res.redirect(`/add-request?error=${encodeURIComponent(validationError)}&employeeId=${employeeId}`);
    }

    // Check for conflicts with public holidays

    const holidayConflict = await checkHolidayConflicts(startDate, endDate, employeeId);
    if (holidayConflict) {
        return res.redirect(`/add-request?error=${encodeURIComponent(holidayConflict)}&employeeId=${employeeId}`);
    }


    const newRequest: HolidayRequest = {
        id: holidayRequests.length + 1,
        employee_id: Number(employeeId),
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        status: "pending"
    };

    const isDuplicate = await isDuplicateRequest(newRequest);

    if (isDuplicate) {
        return res.redirect(`/add-request?error=Duplicate holiday request detected.&employeeId=${employeeId}`);
      } else {
        await requestController.createRequest(newRequest)  /////////////////////////
      }

    console.log(`User with ${newRequest.employee_id} id create new Holiday Request ` + 
                `from ${newRequest.start_date.toLocaleDateString('en-CA')} ` + 
                `to ${newRequest.end_date.toLocaleDateString('en-CA')}`)

    res.redirect('/requests');

});


export default router;