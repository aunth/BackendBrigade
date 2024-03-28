
import express, {Response, Request} from 'express';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { getEmployeeId } from '../utils/utils';
import { authenticationMiddleware } from '../config/passportConfig';


const router = express.Router();

router.get('/', authenticationMiddleware, async (req: Request, res: Response) => {
  res.render('main');
});

router.post('/', async (req, res) => {
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
          return res.redirect(`/add-request?employeeId=${encodeURIComponent(employee_id)}`);
        case 'update':
          return res.redirect(`/update-request?employeeId=${encodeURIComponent(employee_id)}`);
        case 'delete':
          return res.redirect(`/delete?employeeId=${encodeURIComponent(employee_id)}`);
        default:
          return res.status(400).send('Unknown action');
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;