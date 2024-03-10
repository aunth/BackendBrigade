const express = require('express');
const router = express.Router();
const { holidayRequests } = require('../dataStore');

// Route to display list of holiday requests
router.get('/', (req, res) => {
    res.render('holidays', { holidayRequests });
});

// Add more routes as needed for handling holiday request submissions, etc.

module.exports = router;