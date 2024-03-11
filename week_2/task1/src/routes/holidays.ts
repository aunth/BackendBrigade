
import express, {Response, Request} from 'express';
import { getNameById, getHolidayRequests } from '../utils/utils';
import { HolidayRequest } from '../types/types';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    const holidayRequests: HolidayRequest[] = getHolidayRequests();
    res.render('holidays', {holidayRequests, getNameById});
});

export default router;
