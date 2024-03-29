import "reflect-metadata"
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mainRouter from './routes/main';
import loginRouter from './routes/login';
import verifyTwoFaRouter from './routes/verify-2fa';
import employeesRouter from './routes/employees';
import holidaysRouter from './routes/requests';
import addRequestsRouter from './routes/add-request';
import updateRequestRouter from './routes/update-request';
import deleteRouter from './routes/deleteRequest';
import switchDb from './routes/switchDb';
import refreshJwt from './routes/refreshJwt';
import { dbConnector } from "./database_integration/db";
import { DatabaseType } from "./database_integration/db";
import passport from "./config/passportConfig";
import cookieParser from 'cookie-parser';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3000;


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


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
app.use('/', loginRouter);
app.use('/verify-2fa', verifyTwoFaRouter);
app.use('/main', mainRouter);
app.use('/switch-db', switchDb);
app.use('/refresh-jwt', refreshJwt);
app.use('/delete', deleteRouter);
app.use('/employees', employeesRouter);
app.use('/requests', holidaysRouter);
app.use('/add-request', addRequestsRouter);
app.use('/update-request', updateRequestRouter)

// Starting the server
app.listen(port, () => {
  // Initialize the connect with MongoDB
  dbConnector.switchDatabase(DatabaseType.PostgreSQL);
  console.log(`Server running at http://localhost:${port}`);
});
