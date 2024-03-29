import { DatabaseType, DBConnector } from '../database_integration/db';
import { uri } from '../database_integration/db';
import { AppDataSource } from '../database';
import express from 'express';


const router = express.Router();

const dbConnector = DBConnector.getInstance(uri, AppDataSource);

router.get('/:dbType', async (req, res) => {
    const dbType = req.params.dbType;
    if (!Object.values(DatabaseType).includes(dbType as DatabaseType)) {
        return res.status(400).send('Invalid database type');
    }

    try {
        await dbConnector.switchDatabase(dbType as DatabaseType);
        console.log(`Switched to ${dbType}`)
        res.redirect('/');
    } catch (error) {
        console.error('Error switching databases:', error);
        res.status(500).send('Failed to switch database');
    }
});

export default router;