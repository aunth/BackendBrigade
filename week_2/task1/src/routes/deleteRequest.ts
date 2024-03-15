
import express, {Response, Request} from 'express'
import { getEmployees, getHolidayRequests, deleteRequest, getNameById } from '../utils/utils';

const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
	const employees = getEmployees();
	const employee = employees.filter((emp) => emp.id === Number(req.query.employeeId));

	if (employee.length == 0) {
		return res.render('deleteRequest', {error: "There is not user with this id"});
	}
	const holidayRequests = getHolidayRequests(employee[0].id);

	res.render('deleteRequest', {holidayRequests: holidayRequests, getNameById});
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const requestId = req.params.id;

        const success = deleteRequest(Number(requestId));

        if (success) {
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