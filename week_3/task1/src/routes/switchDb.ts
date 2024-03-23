import { DatabaseType, DBConnector } from '../database_integration/db';
import { uri } from '../database_integration/db';
import { AppDataSource } from '../database';
import express, {Response, Request} from 'express';
import { HolidayRequest} from '../types/types';
//import { getEmployees, getHolidayRequests, saveHolidayRequest} from '../utils/dataManager';
//import { validateRequestDates, checkHolidayConflicts, isDuplicateRequest, getPublicHolidays} from '../utils/holidayManager';
import { findEmploee } from '../utils/utils';
import { requestController } from '../controllers/request.controller';
import { employeeController } from '../controllers/employee.controller';
import { dbWorker } from '../database_integration/DataBaseWorker';


const router = express.Router();

const dbConnector = DBConnector.getInstance(uri, AppDataSource);

// Assuming the use of express.Router() or directly with app.post
router.get('/:dbType', async (req, res) => {
    const dbType = req.params.dbType; // Now expecting dbType to be in the request body
    console.log(dbType);
    if (!Object.values(DatabaseType).includes(dbType as DatabaseType)) {
        return res.status(400).send('Invalid database type');
    }

    try {
        await dbConnector.switchDatabase(dbType as DatabaseType);
        //res.send(`Switched to ${dbType}`);
        console.log(`Switched to ${dbType}`)
        res.redirect('/');
    } catch (error) {
        console.error('Error switching databases:', error);
        res.status(500).send('Failed to switch database');
    }
});

export default router;