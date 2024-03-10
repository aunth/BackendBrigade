const express = require('express');
const router = express.Router();
const { holidayRequests, employees, getNameById } = require('../dataStore');

router.get('/', (req, res) => {
    res.render('holidays', { holidayRequests, getNameById, employees});
});


module.exports = router;