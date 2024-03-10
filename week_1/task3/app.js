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

// Routes
// Display list of employees
app.get('/employees', (req, res) => {
  res.render('employees', { employees });
});

// Display list of holiday requests
app.get('/holidays', (req, res) => {
  res.render('holidays', { holidayRequests });
});

// Display form to add a new holiday request
app.get('/add-holiday', (req, res) => {
  res.render('add-holiday', { employees });
});

// Handle form submission for adding a holiday request
app.post('/add-holiday', (req, res) => {
  const { employeeId, startDate, endDate } = req.body;
  // Add logic to update holidayRequests array or data store
  console.log('Holiday Request Added:', { employeeId, startDate, endDate }); // Placeholder for actual logic
  res.redirect('/holidays');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});