
import express, {Response, Request} from 'express';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { getEmployeeId } from '../utils/utils';


const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.render('main');
});

router.post('/request-action', async (req, res) => {
  const { employeeName, action } = req.body;

  try {
    const employee = await dbWorker.getEmployeeByName(employeeName);
    if (!employee) {
      res.status(404).send(`Employee with name ${employeeName} does not exist.`);
      return;
    } else {
      const employee_id = await getEmployeeId(employee);
      switch (action) {
        case 'create':
            res.redirect(`/add-request?employeeId=${encodeURIComponent(employee_id)}`);
            return;
        case 'update':
            res.redirect(`/update-request?employeeId=${encodeURIComponent(employee_id)}`);
            return;
        case 'delete':
            return res.redirect(`/delete?employeeId=${encodeURIComponent(employee_id)}`);
        default:
            res.status(400).send('Unknown action');
            return;
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;