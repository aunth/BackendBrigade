
import express, {Response, Request} from 'express';
import { getNameById } from '../utils/utils';
//import { getHolidayRequests } from '../utils/dataManager';
//import { approveRequest, rejectRequest } from '../utils/holidayManager';
import { HolidayRequest } from '../types/types';
import { requestController } from '../controllers/request.controller';

const router = express.Router();

//router.get('/', requestController.getRequests);

router.get('/', async(req:Request, res:Response) => {
    try {
        const holidayRequests = await requestController.getAllRequests();
        const requestsWithNames = await Promise.all(holidayRequests.map(async (request) => {
            const employeeName = await getNameById(request.employee_id);
            return { ...request, employeeName };
        }));
        res.render('requests', { holidayRequests: requestsWithNames});
    } catch (error) {
    // Handle error appropriately
    console.error(error);
    res.status(500).send("An error occurred");
}});

//router.post('/approved/:requestId', requestController.updateRequestStatus);

router.post('/approved/:requestId', async(req:Request, res:Response) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body;

        if (action !== 'approved' && action !== 'rejected') {
            return res.status(400).json({ error: 'Invalid action provided' });
        }


        await requestController.updateRequestStatus(action, requestId);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).send('An error occurred');
    }
});

//router.post('/rejected/:requestId', requestController.updateRequestStatus);

router.post('/rejected/:requestId', async(req:Request, res:Response) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body;

        if (action !== 'approved' && action !== 'rejected') {
            return res.status(400).json({ error: 'Invalid action provided' });
        }

        await requestController.updateRequestStatus(action, requestId);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).send('An error occurred');
    }
});

export default router;
