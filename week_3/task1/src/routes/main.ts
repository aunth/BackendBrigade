
import express, {Response, Request} from 'express';
import { getNameById } from '../utils/utils'
import { employeeWorker } from '../database_integration/EmployeeWorker';
import { Connector } from '../database_integration/db';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { getEmployees } from '../utils/dataManager';


const router = express.Router();

Connector.connect();


router.get('/', async (req: Request, res: Response) => {
    res.render('main');

    await dbWorker.getDepartmentsFromObject();
    
    await dbWorker.getEmployeesFromObject();
});


router.post('/request-action', async (req, res) => {
  const { employeeName, action } = req.body;

  try {
    const employee = await dbWorker.getEmployeesByName(employeeName);
    console.log(employee);
    if (!employee) {
        res.status(404).send(`Employee with name ${employeeName} does not exist.`);
        return;
    }
    switch (action) {
        case 'create':
            res.redirect(`/add-request?employeeId=${encodeURIComponent(employee.id.toString())}`);
            return;
        case 'update':
            res.redirect(`/update-request?employeeId=${encodeURIComponent(employee.id.toString())}`);
            return;
        case 'delete':
            return res.redirect(`/delete?employeeId=${encodeURIComponent(employee.id.toString())}`);
        default:
            res.status(400).send('Unknown action');
            return;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;