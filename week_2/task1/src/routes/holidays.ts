
import express, {Response, Request} from 'express';
import { holidayRequests } from '../../data/dataStore';
import { getNameById} from '../utils/utils';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    
    res.render('holidays', {holidayRequests, getNameById});
    
});

export default router;
