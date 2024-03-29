
import express, {Response, Request} from 'express';
import { dbHandler } from '../database_integration/DataBaseWorker';
import { approveRequest, rejectRequest } from '../utils/holidayManager';
//mport { requireAuth } from '../config/passportConfig';
import { authenticationMiddleware } from '../config/passportConfig';
import { employeeWorker } from '../database_integration/EmployeeWorker';

const router = express.Router();


router.get('/', authenticationMiddleware, async(req:Request, res:Response) => {
    try {
        const employeeName = req.body.name;
        if (employeeName) {
            const employeeId = await dbHandler.getEmployeeIdByName(employeeName)
            const holidayRequests = await dbHandler.getRequests();
            const employees = [await dbHandler.getEmployeeById(employeeId)];
            res.render('requests', { holidayRequests: holidayRequests, employees});
        } else {
            const holidayRequests = await dbHandler.getRequests();
            const employees = await dbHandler.getEmployees();
            res.render('requests', { holidayRequests: holidayRequests, employees});
        }
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
