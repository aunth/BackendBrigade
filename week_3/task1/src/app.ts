import "reflect-metadata"
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import { AppDataSource } from './database'; // Adjust the path as necessary
import mainRouter from './routes/main';
import employeesRouter from './routes/employees';
import holidaysRouter from './routes/requests';
import addRequestsRouter from './routes/add-request';
import updateRequestRouter from './routes/update-request';
import deleteRouter from './routes/deleteRequest';
import switchDb from './routes/switchDb';
import { DBConnector } from "./database_integration/db";
import { dbConnector } from "./database_integration/db";
import { DatabaseType } from "./database_integration/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Initialize the DBConnector with MongoDB URI and PostgreSQL DataSource
//const dbConnector = DBConnector.getInstance(uri, AppDataSource);


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/jso
// Static files
app.use(express.static(path.join(__dirname, '../public')))
// EJS Setup
app.set('view engine', 'ejs')
// Logging Middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  next();
})
// Routes
app.use('/', mainRouter);
app.use('/switch-db', switchDb);
app.use('/delete', deleteRouter);
app.use('/employees', employeesRouter);
app.use('/requests', holidaysRouter);
app.use('/add-request', addRequestsRouter);
app.use('/update-request', updateRequestRouter)
// Starting the server
app.listen(port, () => {
  dbConnector.switchDatabase(DatabaseType.MongoDB);
  console.log(`Server running at http://localhost:${port}`);
});
