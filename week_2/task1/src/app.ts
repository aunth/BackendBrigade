import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');

// Logging Middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  next();
});

import employeesRouter from './routes/employees';
import holidaysRouter from './routes/holidays';
import addHolidayRouter from './routes/add-holiday';

app.use('/employees', employeesRouter);
app.use('/holidays', holidaysRouter);
app.use('/add-holiday', addHolidayRouter);

// Starting the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});