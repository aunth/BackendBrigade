const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

router.get('/', (req, res) => {
    res.render('add-holiday');
});

router.post('/', (req, res) => {
    const {employeeId, startDate, endDate} = req.body;
    const empId = Number(employeeId);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!employeeId || !startDate || !endDate) {
        return res.redirect('add-holiday?error=Invalid input');
    }

    const employee = dataStore.employees.find(emp => emp.id === empId)
    if (!employee){
        return res.redirect('/add-holiday?error=Employee not found');
    }

    if (start > end) {
        return res.redirect('/add-holiday?error=Start date must be before end date');
    }

    const dayDifference = (end - start) / (1000 * 3600 * 24) + 1;
    if (dayDifference > dataStore.holidayRules[0].maxConsecutiveDays) {
        return res.redirect('/add-holiday?error=Exceeds maximum consecutive holiday days');
    } else if (employee.remainingHolidays < dayDifference) {
        return res.redirect('/add-holiday?error=Insufficient remaining holiday days');
    }

    // Check for blackout periods
    const inBlackoutPeriod = dataStore.holidayRules[0].blackoutPeriods.some(period => {
        const blackoutStart = new Date(period.start);
        const blackoutEnd = new Date(period.end);
        return (start <= blackoutEnd && start >= blackoutStart) || (end <= blackoutEnd && end >= blackoutStart);
    });

    if (inBlackoutPeriod) {
        return res.redirect('/add-holiday?error=Request falls within a blackout period');
    }

    const newRequest = {
        idForRequest: dataStore.holidayRequests.length + 1,
        employeeId: empId,
        startDate: start,
        endDate: end,
        status: 'pending'
    };

    console.log(`User with ${newRequest.employeeId} id create new Holiday Request ` + 
                `from ${newRequest.startDate.toLocaleDateString('en-CA')} ` + 
                `to ${newRequest.endDate.toLocaleDateString('en-CA')}`)

    dataStore.holidayRequests.push(newRequest);

    res.redirect('/holidays');

});

module.exports = router