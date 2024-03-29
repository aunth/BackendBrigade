import express from 'express';
import passport from 'passport';
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
import registerRouter from './routes/registration';
import googleAuthRouter from './routes/google-auth';
//import passport from "./config/passportConfig";
import cookieParser from 'cookie-parser';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'ejs')

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  next();
})

app.use('/registration', registerRouter);
app.use('/auth/google', googleAuthRouter);
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

app.listen(port, async () => {
  await dbConnector.switchDatabase(DatabaseType.MongoDB);
  console.log(`Server running at http://localhost:${port}`);
});
