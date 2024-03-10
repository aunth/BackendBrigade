const express = require('express');
const router = express.Router();
const { employees, holidayRequests } = require('../dataStore');

// Route to display list of employees
router.get('/', (req, res) => {
      res.render('employees', { employees, holidayRequests });
});

module.exports = router;