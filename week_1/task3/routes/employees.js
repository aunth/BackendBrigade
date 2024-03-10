const express = require('express');
const router = express.Router();
const { employees } = require('../dataStore');

// Route to display list of employees
router.get('/', (req, res) => {
    res.render('employees', { employees });
});

module.exports = router;