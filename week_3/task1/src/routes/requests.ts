
import express, {Response, Request} from 'express';
import { getNameById } from '../utils/utils';
//import { getHolidayRequests } from '../utils/dataManager';
//import { approveRequest, rejectRequest } from '../utils/holidayManager';
import { HolidayRequest } from '../types/types';
import { requestController } from '../controllers/request.controller';
import { dbWorker } from '../database_integration/DataBaseWorker';
import { approveRequest, rejectRequest } from '../utils/holidayManager';

const router = express.Router();


router.get('/', async(req:Request, res:Response) => {
    try {
        const holidayRequests = await dbWorker.getRequests();
        const employees = await dbWorker.getEmployees();
        res.render('requests', { holidayRequests: holidayRequests, employees});
    } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
}});


router.post('/approved/:requestId', async(req:Request, res:Response) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body;

        if (action !== 'approved' && action !== 'rejected') {
            return res.status(400).json({ error: 'Invalid action provided' });
        }


        await approveRequest(requestId);

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

        await rejectRequest(requestId);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).send('An error occurred');
    }
});

export default router;
