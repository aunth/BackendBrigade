const express = require('express');
const path = require('path');
const { employees, holidayRequests } = require('./dataStore');

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

const employeesRouter = require('./routes/employees');
const holidaysRouter = require('./routes/holidays');
//const addHolidayRouter = require('./routes/add-holiday');

// Mount route handlers
app.use('/employees', employeesRouter);
app.use('/holidays', holidaysRouter);
//app.use('/add-holiday', addHolidayRouter);

// Starting the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});