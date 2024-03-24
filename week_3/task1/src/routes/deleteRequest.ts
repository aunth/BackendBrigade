
import express, {Response, Request} from 'express'
import { getNameById } from '../utils/utils';
//import { getEmployees, getHolidayRequests} from '../utils/dataManager';
import { HolidayRequest} from '../types/types';

import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { departmentController } from '../controllers/department.controller';
import { blackoutPeriodsController } from '../controllers/blackoutperiods.controller';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { Types } from "mongoose";

const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
	//const employees = await employeeController.getEmployees();
    const employeeName = req.query.employeeName as string
    const employeeId = await dbWorker.getEmployeeIdByEmployeeName(employeeName);
	const employee = await dbWorker.getEmployeeById(employeeId);
	//const employee = employees.filter((emp) => emp.id === Number(req.query.employeeId));

	if (!employee) {
		return res.render('deleteRequest', {error: "There is not user with this id"});
	}
	//const allRequests: HolidayRequest[] = await requestController.getAllRequests();

    //const employeeHolidayRequests = allRequests.filter(request => request.employee_id == employee[0].id);
    const employeeHolidayRequests = await dbWorker.getHolidayRequestsByEmployee(employeeId);

	//const employeeName = await getNameById(employee[0].id);


	res.render('deleteRequest', {holidayRequests: employeeHolidayRequests, employeeName: employeeName});
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        let requestId;
        try {
            requestId = parseInt(req.params.id, 10);
        } catch {
            requestId = new Types.ObjectId(req.params.id);
        }

        //const success = await requestController.deleteRequest(Number(requestId));
        const isDeleted = await dbWorker.deleteRequestById(requestId);

        if (isDeleted) {
            res.status(200).json({ message: 'Request was deleted' });
        } else {
            res.status(500).send('Failed to delete holiday request');
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal server error');
    }
});



export default router;