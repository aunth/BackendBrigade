import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import dotenv from 'dotenv';
import mainRouter from './routes/main';
import employeesRouter from './routes/employees';
import holidaysRouter from './routes/requests';
import addRequestsRouter from './routes/add-request';
import updateRequestRouter from './routes/update-request';
import deleteRouter from './routes/deleteRequest';
import switchDb from './routes/switchDb';
import { dbConnector } from "./database_integration/db";
import { DatabaseType } from "./database_integration/db";
import registerRouter from './routes/registration';
import googleAuthRouter from './routes/google-auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'ejs')

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  next();
})

// Routes
app.use('/', mainRouter);
app.use('/registration', registerRouter);
app.use('/auth/google', googleAuthRouter);
app.use('/switch-db', switchDb);
app.use('/delete', deleteRouter);
app.use('/employees', employeesRouter);
app.use('/requests', holidaysRouter);
app.use('/add-request', addRequestsRouter);
app.use('/update-request', updateRequestRouter)

// Start the server
app.listen(port, async () => {
  // Initialize the connection with MongoDB
  await dbConnector.switchDatabase(DatabaseType.MongoDB);
  console.log(`Server running at http://localhost:${port}`);
});
