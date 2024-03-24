
import express, {Response, Request} from 'express'
import { getNameById } from '../utils/utils';
//import { getEmployees, getHolidayRequests} from '../utils/dataManager';
import { HolidayRequest} from '../types/types';

import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { departmentController } from '../controllers/department.controller';
import { blackoutPeriodsController } from '../controllers/blackoutperiods.controller';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { RequestInterface } from '../database_integration/models';
import { Types } from 'mongoose';
import { dbConnector, DatabaseType } from '../database_integration/db';

const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
	let employeeId: Types.ObjectId | number | string = req.query.employeeId as string;

	if (!employeeId) {
		return res.render('deleteRequest', {error: "There is not user with this id"});
	}

	if (dbConnector.currentDatabaseType == DatabaseType.MongoDB) {
        employeeId = new Types.ObjectId(employeeId);
    } else {
        employeeId = Number(employeeId);
    }
	const employeeHolidayRequests: HolidayRequest[] | RequestInterface[] = await dbWorker.getHolidayRequestsByEmployeeId(employeeId);

	const employeeName = await getNameById(employeeId);

	res.render('deleteRequest', {holidayRequests: employeeHolidayRequests, employeeName: employeeName});
})

router.delete('/:id', async (req: Request, res: Response) => {
   try {
       let requestId: Types.ObjectId | number | string = req.params.id;

	if (dbConnector.currentDatabaseType == DatabaseType.MongoDB) {
        requestId = new Types.ObjectId(requestId);
    } else {
        requestId = Number(requestId);
    }

       const isDelete = await dbWorker.deleteRequestById(requestId);

       if (isDelete) {
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