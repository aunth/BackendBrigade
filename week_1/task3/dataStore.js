
module.exports = {

    employees : [
        { id: 1, name: 'John Doe', remainingHolidays: 10 },
        { id: 2, name: 'Jane Smith', remainingHolidays: 8 },
        { id: 3, name: 'Alice Johnson', remainingHolidays: 12 }
      ],
    
    holidayRequests : [
        { idForRequest: 1, employeeId: 1, startDate: new Date('2024-04-01'), endDate: new Date('2024-04-05'), status: 'pending' },
        { idForRequest: 2, employeeId: 2, startDate: new Date('2024-05-10'), endDate: new Date('2024-05-15'), status: 'pending' },
        { idForRequest: 3, employeeId: 3, startDate: new Date('2024-06-20'), endDate: new Date('2024-06-25'), status: 'pending' }
      ],

    holidayRules : [{
      maxConsecutiveDays: 10,
      blackoutPeriods: [
        { start: new Date(2024, 11, 24), end: new Date(2024, 11, 26) }
      ]
    }
    ],
    getNameById: function(id) {
        const employee = this.employees.find(employee => employee.id === id);
        return employee ? employee.name : 'Unknown';
    }
};
