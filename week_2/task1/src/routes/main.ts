
import express, {Response, Request} from 'express';
import { getNameById, getHolidayRequests } from '../utils/utils';
import { HolidayRequest } from '../types/types';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render('main');
});


router.post('/request-action', (req, res) => {
    const { employeeId, action } = req.body;
    switch (action) {
      case 'create':
        res.redirect(`/add-request?employeeId=${encodeURIComponent(employeeId)}`);
        return;
      case 'update':
        // Logic to update a request
        break;
      case 'delete':
        // Logic to delete a request
        break;
      default:
        // Handle unknown action
        res.status(400).send('Unknown action');
    }
  
    // Redirect back to the main page or send a response
    res.redirect('/');
  });

export default router;