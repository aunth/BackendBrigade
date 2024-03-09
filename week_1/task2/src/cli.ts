import inquirer from "inquirer";
import { employees, holidayRequests, holidayRulesByDepartment } from './dataStore.js';
import { Employee, HolidayRequest, Department } from './types.js';


(async () => {
  async function mainMenu() {
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Employee Holiday Management System',
      choices: [
        'Add a new employee',
        'View list of employees',
        'Submit a holiday request',
        'View pending holiday requests',
        'Approve or reject a holiday request',
        'Edit holiday rules',
        'Exit'
      ],
    }]);

    switch (action) {
      case 'Add a new employee':
        await addEmployeeFlow();
        break;
      case 'View list of employees':
        await printEmployeeList();
        break;
      case 'Submit a holiday request':
        await submitHolidayRequestFlow();
        break;
      case 'View pending holiday requests':
        await viewPendingRequests();
        break;
      case 'Approve or reject a holiday request':
        await approveOrRejectRequest();
        break;
      case 'Edit holiday rules':
        await editHolidayRules();
        break;
      case 'Exit':
        console.log('Exiting...');
        return;
    }

    await mainMenu();
  }

  async function addEmployeeFlow() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: "Employee's name:",
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select your department:',
        choices: Object.values(Department)
      },
      {
        type: 'input',
        name: 'remainingHolidays',
        message: "Number of remaining holidays:",
        validate: (input: string) => !isNaN(parseFloat(input)) || 'Please enter a number',
      },
    ]);

    addEmployee(answers.name, answers.department, parseInt(answers.remainingHolidays, 10));
    console.log('Employee added successfully.');
  }
  
  function addEmployee(name: string, department: Department, remainingHolidays: number): void {
    const maxId = employees.reduce((max, employee) => Math.max(max, employee.id), 0);
    const newEmployee: Employee = {
      id: maxId + 1,
      name,
      department,
      remainingHolidays,
    };
    employees.push(newEmployee);
  }


function getNameById(id: number): string | undefined {
    const user = employees.find(employee => employee.id === id);
  
    if (!user) {
      return undefined;
    }
  
    return user.name;
  }

async function printEmployeeList() {
  employees.forEach(employee => {
    console.log(`${employee.id} - ${employee.name}, ${employee.department} (${employee.remainingHolidays} days remaining)`);
    const employeeRequests = holidayRequests.filter(request => request.employeeId === employee.id);
    if (employeeRequests.length > 0) {
      console.log(`\tHoliday Requests:`);
      employeeRequests.forEach(request => {
        console.log(`\t- Request ID: ${request.idForRequest}, From ${request.startDate.toLocaleDateString('en-CA')} to ${request.endDate.toLocaleDateString('en-CA')}, Status: ${request.status}`);
      });
    } else {
      console.log(`\tNo holiday requests.`);
    }
  });
}

async function viewPendingRequests() {
  console.log('List of Pending Holiday Requests:');
  holidayRequests.filter(request => request.status === 'pending').forEach(request => {
    console.log(`Request ID: ${request.idForRequest}, Employee ID: ${request.employeeId}` + 
    `(${getNameById(request.employeeId)}), Start Date: ${request.startDate.toLocaleDateString('en-CA')},` +
    `End Date: ${request.endDate.toLocaleDateString('en-CA')}`);
  });
}

async function approveOrRejectRequest() {

  const requestChoices = holidayRequests.map(request => ({
      name: `ID: ${request.employeeId}(${getNameById(request.employeeId)}), Start Date: ${request.startDate.toLocaleDateString('en-CA')}, End Date: ${request.endDate.toLocaleDateString('en-CA')}`,
      value: request.idForRequest,
  }));

  const { requestId } = await inquirer.prompt([
      {
          type: 'list',
          name: 'requestId',
          message: 'Select a holiday request to approve or reject:',
          choices: requestChoices
      }
  ]);

  const { approvalAction } = await inquirer.prompt([
      {
          type: 'list',
          name: 'approvalAction',
          message: 'Approve or reject the selected holiday request?',
          choices: ['Approve', 'Reject']
      }
  ]);

  const selectedRequest = holidayRequests.find(request => request.idForRequest === requestId);
  if (!selectedRequest) {
    console.log('Request not found.');
    return ;
  }
  if (approvalAction === 'Approve') {
      selectedRequest.status = 'approved';
      let employee = employees.find(emp => emp.id == selectedRequest.employeeId);
      if (employee) {
        const holidaysTaken = (selectedRequest.endDate.getTime() - selectedRequest.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
        employee.remainingHolidays -= holidaysTaken;
        console.log(`Holiday request approved.`);
      } else {
        console.log('Employee not found for the request.');
      }
      console.log(`Holiday request ${selectedRequest.status}.`);
  } else {
      selectedRequest.status = 'rejected';
      console.log('Request not found.');
  }

  const employeeName = getNameById(selectedRequest.employeeId);
  if (employeeName) {
    console.log(`Notification: ${employeeName}, your holiday request from ${selectedRequest.startDate.toLocaleDateString('en-CA')} to ${selectedRequest.endDate.toLocaleDateString('en-CA')} has been ${selectedRequest.status}.`);
  } else {
    console.log("Employee not found for the request.");
  }

  console.log(`Holiday request ${selectedRequest.employeeId} ${approvalAction.toLowerCase()}ed.`);
}

let nextRequestId = 1;

  async function submitHolidayRequestFlow(){
    const { employeeId, startDate, endDate } = await inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: "Enter the employee's ID:",
        validate: (input: string) => !isNaN(parseInt(input)) && /^-?\d+(\.\d+)?$/.test(input) || 'Please enter a valid employee ID',
      },
      {
        type: 'input',
        name: 'startDate',
        message: "Enter the start date (YYYY-MM-DD):",
        validate: (input: string) => /^\d{4}-\d{2}-\d{2}$/.test(input) && !isNaN(new Date(input).getTime()) || 'Please enter a valid date',
      },
      {
        type: 'input',
        name: 'endDate',
        message: "Enter the end date (YYYY-MM-DD):",
        validate: (input: string) => /^\d{4}-\d{2}-\d{2}$/.test(input) && !isNaN(new Date(input).getTime()) || 'Please enter a valid date',
      },
    ]);

    const start = new Date(startDate);
    const end = new Date(endDate)

  
    const validationResult = validateHolidayRequest(parseInt(employeeId, 10), start, end);
    if (validationResult.isValid) {
      const newHolidayRequest: HolidayRequest = {
        idForRequest: nextRequestId++,
        employeeId: parseInt(employeeId, 10),
        startDate: start,
        endDate: end,
        status: 'pending'
      };
      holidayRequests.push(newHolidayRequest)
      console.log("Holiday request submitted successfully.");
    } else {
      console.log(validationResult.message);
    }
  }

  function validateHolidayRequest(employeeId: number, startDate: Date, endDate: Date) {

    const validateEmployee = employees.find(employee => employee.id === employeeId);
    if (!validateEmployee) {
      return { isValid: false, message: "Employee ID does not exist." };
    }

    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDay = differenceInTime / (1000 * 3600 * 24) + 1;

    const holidayRules = holidayRulesByDepartment[validateEmployee.department];

    if (validateEmployee.remainingHolidays < 1 || differenceInDay > validateEmployee.remainingHolidays) {
      return { isValid: false, message: "Cannot submit holiday request. Insufficient remaining holidays." };
    }

    if (differenceInDay < 1) {
      return { isValid: false, message: "The end date must be after the start date." };
    }

    if (differenceInDay > holidayRules.maxConsecutiveDays) {
      return { isValid: false, message: `Request exceeds the maximum of ${holidayRules.maxConsecutiveDays} consecutive days.` };
    }

    for (let period of holidayRules.blackoutPeriods) {
      let blackoutStart = new Date(period.start).getTime();
      let blackoutEnd = new Date(period.end).getTime();
      if ((startDate.getTime() >= blackoutStart && startDate.getTime() <= blackoutEnd) || (endDate.getTime() >= blackoutStart && endDate.getTime() <= blackoutEnd)) {
        return { isValid: false, message: "Request falls within a blackout period." };
      }
    }
    return { isValid: true, message: "Request is valid." };
  }

  async function editHolidayRules() {
    const { departament } = await inquirer.prompt([{
      type: 'list',
      name: 'departament',
      message: 'Which department\'s rules do you want to change?',
      choices: Object.values(Department),
    }]);

    await editHolidayRulesByDepartament(departament);
  }

  async function editHolidayRulesByDepartament(departament: Department) {

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Edit Holiday Rules',
      choices: [
        'Edit maximum consecutive holiday days',
        'Add a blackout period',
        'Remove a blackout period',
        'Back to Main Menu'
      ],
    }]);
  
    switch (action) {
      case 'Edit maximum consecutive holiday days':
        await editMaxConsecutiveDays(departament);
        break;
      case 'Add a blackout period':
        await addBlackoutPeriod(departament);
        break;
      case 'Remove a blackout period':
        await removeBlackoutPeriod(departament);
        break;
      case 'Back to Main Menu':
        return;
    }

    await mainMenu();
  }

  async function editMaxConsecutiveDays(departament: Department) {
    const { newMax } = await inquirer.prompt([{
      type: 'input',
      name: 'newMax',
      message: "Enter the new maximum number of consecutive holiday days:",
      validate: (input: string) => !isNaN(parseInt(input, 10)) && /^-?\d+(\.\d+)?$/.test(input) || 'Please enter a number',
    }]);

    const holidayRules = holidayRulesByDepartment[departament];
    holidayRules.maxConsecutiveDays = parseInt(newMax)
    console.log(`Maximum consecutive holiday days in ${departament} departament updated to ${newMax}.`);
  }

  async function addBlackoutPeriod(departament: Department) {
    const { startDate, endDate } = await inquirer.prompt([
      {
        type: 'input',
        name: 'startDate',
        message: "Enter the start date of the blackout period (YYYY-MM-DD):",
        validate: (input: string) => /^\d{4}-\d{2}-\d{2}$/.test(input) && !isNaN(new Date(input).getTime()) || 'Please enter a date in the format YYYY-MM-DD',
      },
      {
        type: 'input',
        name: 'endDate',
        message: "Enter the end date of the blackout period (YYYY-MM-DD):",
        validate: (input: string) => /^\d{4}-\d{2}-\d{2}$/.test(input) && !isNaN(new Date(input).getTime()) || 'Please enter a date in the format YYYY-MM-DD',
      },
    ]);

    const holidayRules = holidayRulesByDepartment[departament];
    holidayRules.blackoutPeriods.push({ start: startDate, end: endDate });
    console.log(`Blackout period from ${startDate} to ${endDate} added successfully in ${departament} departament.`);
  }

  async function removeBlackoutPeriod(departament: Department) {
    const holidayRules = holidayRulesByDepartment[departament];
    if (holidayRules.blackoutPeriods.length === 0) {
      console.log("There are no blackout periods to remove.");
      return;
    }
  
    const { selectedPeriod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedPeriod',
        message: 'Select a blackout period to remove:',
        choices: holidayRules.blackoutPeriods.map((period, index) => ({
          name: `${new Date(period.start).toLocaleDateString('en-CA')} to ${new Date(period.end).toLocaleDateString('en-CA')}`,
          value: index
        }))
      }
    ]);

    const removedPeriod = holidayRules.blackoutPeriods.splice(selectedPeriod, 1)[0];
    console.log(`Blackout period from ${new Date(removedPeriod.start).toLocaleDateString('en-CA')} to` + 
    `${new Date(removedPeriod.end).toLocaleDateString('en-CA')} removed successfully from ${departament} departament.`);
  }

  await mainMenu();
})();
