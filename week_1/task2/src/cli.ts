import inquirer from "inquirer";
import { employees, holidayRequests, holidayRules } from './dataStore.js';
import { Employee, HolidayRequest } from './types.js';

(async () => {
  async function mainMenu() {
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
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
        console.log('Functionality not implemented.'); // Placeholder
        break;
      case 'Submit a holiday request':
        console.log('Functionality not implemented.'); // Placeholder
        break;
      case 'View pending holiday requests':
        console.log('Functionality not implemented.'); // Placeholder
        break;
      case 'Approve or reject a holiday request':
        console.log('Functionality not implemented.'); // Placeholder
        break;
      case 'Exit':
        console.log('Exiting...');
        return; // Properly exits the async function
    }

    await mainMenu(); // Loops back to main menu after action completion
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
        validate: (input) => !isNaN(parseFloat(input)) || 'Please enter a number',
      },
    ]);

    addEmployee(answers.name, parseInt(answers.remainingHolidays, 10));
    console.log('Employee added successfully.');
    await mainMenu(); // Ensures the menu is called after the operation
  }

  function addEmployee(name: string, remainingHolidays: number): void {
    const newEmployee: Employee = {
      id: (Math.random() * 1000000).toString(), // Simple ID generation
      name,
      remainingHolidays,
    };
    employees.push(newEmployee);
  }

  // Define and implement submitHolidayRequestFlow and processRequestFlow based on your application's needs

  await mainMenu(); // Initiates the application flow
})();
