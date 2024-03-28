import express, { Response, Request } from 'express';
import { dbHandler } from '../database_integration/DataBaseWorker';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const departments = await dbHandler.getAllDepartments();
        const error = req.query.error || '';
        const name = req.query.name || undefined;
        const email = req.query.email || undefined;
        res.render('registration', { departments, error, name, email });
    } catch (error) {
        console.error('Error rendering registration page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req: Request, res: Response) => {
    const data = req.body;
    try {
        console.log(data);
        await dbHandler.createNewEmployee(data);
        return res.redirect(`/?name=${encodeURIComponent(data.name)}`);
    } catch (error) {
        return res.redirect('/registration?error=' + 'This name already taken');
    }
});

export default router;
