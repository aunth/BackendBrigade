import inquirer from "inquirer";
import { employees, holidayRequests, holidayRules } from './dataStore.js';
import { Employee, HolidayRequest } from './types.js';


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
        type: 'input',
        name: 'remainingHolidays',
        message: "Number of remaining holidays:",
        validate: (input: string) => !isNaN(parseFloat(input)) || 'Please enter a number',
      },
    ]);

    addEmployee(answers.name, parseInt(answers.remainingHolidays, 10));
    console.log('Employee added successfully.');
  }
  
  function addEmployee(name: string, remainingHolidays: number): void {
    const maxId = employees.reduce((max, employee) => Math.max(max, employee.id), 0);
    const newEmployee: Employee = {
      id: maxId + 1,
      name,
      remainingHolidays,
    };
    employees.push(newEmployee);
  }


function getNameById(id: number): string | undefined {
    const user = employees.find(employee => employee.id === id);
  
    if (!user) {
      return undefined; // or null, depending on your preference
    }
  
    return user.name;
  }

async function printEmployeeList() {
  employees.forEach(employee => {
    console.log(`${employee.id} - ${employee.name} (${employee.remainingHolidays} days remaining)`);
  });
}

async function viewPendingRequests() {
  console.log('List of Pending Holiday Requests:');
  holidayRequests.filter(request => request.status === 'pending').forEach(request => {
    console.log(`Employee ID: ${request.employeeId}(${getNameById(request.employeeId)}), ` +
    `Start Date: ${request.startDate.toLocaleDateString('en-GB')}, ` +
    `End Date: ${request.endDate.toLocaleDateString('en-GB')}`);
  });
}

async function approveOrRejectRequest() {

  const requestChoices = holidayRequests.map(request => ({
      name: `ID: ${request.employeeId}(${getNameById(request.employeeId)}), Start Date: ${request.startDate.toLocaleDateString('en-GB')}, End Date: ${request.endDate.toLocaleDateString('en-GB')}`,
      value: request.employeeId,
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

  const selectedRequest = holidayRequests.find(request => request.employeeId === requestId);
  if (!selectedRequest) {
    return ;
  }
  if (approvalAction === 'Approve') {
      selectedRequest.status = 'approved';
  } else {
      selectedRequest.status = 'rejected';
  }

  console.log(`Holiday request ${selectedRequest.employeeId} ${approvalAction.toLowerCase()}ed.`);
}

  async function submitHolidayRequestFlow(){
    const { employeeId, startDate, endDate } = await inquirer.prompt([
      {
        type: 'number',
        name: 'employeeId',
        message: "Enter the employee's ID:",
        validate: (input: string) => !isNaN(parseInt(input, 10)) || 'Please enter a valid employee ID',
      },
      {
        type: 'input',
        name: 'startDate',
        message: "Enter the start date (YYYY-MM-DD):",
        validate: (input: string) => !isNaN(new Date(input).getTime()) || 'Please enter a valid date',
      },
      {
        type: 'input',
        name: 'endDate',
        message: "Enter the end date (YYYY-MM-DD):",
        validate: (input: string) => !isNaN(new Date(input).getTime()) || 'Please enter a valid date',
      },
    ]);

    const start = new Date(startDate);
    const end = new Date(endDate)

    const validationResult = validateHolidayRequest(employeeId, start, end);
    if (validationResult.isValid) {
      const newHolidayRequest: HolidayRequest = {
        employeeId: employeeId,
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

    if (differenceInDay > holidayRules.maxConsecutiveDays) {
      return { isValid: false, message: `Request exceeds the maximum of ${holidayRules.maxConsecutiveDays} consecutive days.` };
    }

    for (let period of holidayRules.blackoutPeriods) {
      let blackoutStart = new Date(period.start);
      let blackoutEnd = new Date(period.end);
      if ((startDate >= blackoutStart && startDate <= blackoutEnd) || (endDate >= blackoutStart && endDate <= blackoutEnd)) {
        return { isValid: false, message: "Request falls within a blackout period." };
      }
    }
    return { isValid: true, message: "Request is valid." };
  }

  await mainMenu();
})();
