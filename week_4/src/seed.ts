import { DataSource } from "typeorm";
import { Department } from "../src/entity/Department";
import { BlackoutPeriod } from "../src/entity/BlackoutPeriod";
import { Employee } from "../src/entity/Employee";
import { Request } from "../src/entity/Request";
import { EmployeeCredentials } from "./entity/EmployeeCredential";
//import { AppDataSource } from "./database";
import dotenv from 'dotenv';
dotenv.config();


//const initialAppDataSource = new DataSource({
//    type: "postgres",
//    host: process.env.POSTGRESQL_HOST,
//    port: Number(process.env.POSTGRESQL_PORT),
//    username: process.env.POSTGRESQL_USER,
//    password: process.env.POSTGRESQL_PASSWORD,
//    database: process.env.POSTGRESQL_DATABASE,
//    entities: [Employee, Request, Department, BlackoutPeriod, EmployeeCredentials],
//    synchronize: true,
//    dropSchema: false,
//    logging: true,
//    ssl: {
//        rejectUnauthorized: true
//    }
//  });

const initialAppDataSource = new DataSource({
    type: "postgres",
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'test',
    entities: [Employee, Request, Department, BlackoutPeriod, EmployeeCredentials],
    synchronize: true,
    dropSchema: false,
    logging: true,
    //ssl: {
    //    rejectUnauthorized: true
    //}
  });


enum RequestStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

async function seedUsers() {
  await initialAppDataSource.initialize();

  // Seed Departments
  const departmentsData = [
    { name: "IT", max_consecutive_days: 10 },
    { name: "HR", max_consecutive_days: 12 },
    { name: "FINANCE", max_consecutive_days: 15 },
    { name: "MARKETING", max_consecutive_days: 8 },
    { name: "SALES", max_consecutive_days: 7 },
  ];
  const departments = initialAppDataSource.getRepository(Department).create(departmentsData);
  await initialAppDataSource.getRepository(Department).save(departments);

  const savedDepartments = await initialAppDataSource.getRepository(Department).find();

  // Seed BlackoutPeriods
  const blackoutPeriodsData = [
    { department: savedDepartments[0], start_date: "2024-03-14", end_date: "2024-03-16" },
    { department: savedDepartments[1], start_date: "2024-07-01", end_date: "2024-07-15" },
    { department: savedDepartments[2], start_date: "2024-03-01", end_date: "2024-03-15" },
    { department: savedDepartments[3], start_date: "2024-05-01", end_date: "2024-05-07" },
    { department: savedDepartments[4], start_date: "2024-10-01", end_date: "2024-10-07" },
  ];
  const blackoutPeriods = initialAppDataSource.getRepository(BlackoutPeriod).create(blackoutPeriodsData);
  await initialAppDataSource.getRepository(BlackoutPeriod).save(blackoutPeriods);

  // Seed Employees
  const employeesData = [
    { name: "John Doe", department_id: savedDepartments.find(dep => dep.name === "IT")?.id, country: "UA", remaining_holidays: 8 },
    { name: "Jane Smith", department_id: savedDepartments.find(dep => dep.name === "HR")?.id, country: "IT", remaining_holidays: 29 },
    { name: "John Smith", department_id: savedDepartments.find(dep => dep.name === "HR")?.id, country: "UA", remaining_holidays: 15 },
  ];
  const employees = initialAppDataSource.getRepository(Employee).create(employeesData);
  await initialAppDataSource.getRepository(Employee).save(employees);

  // Fetch employees again to ensure we have their IDs
  const savedEmployees = await initialAppDataSource.getRepository(Employee).find();


  // Seed EmployeeCredentails
  const employeeCredentialsData = [
    { email: 'biletskyi.game@gmail.com', password: '1111', employee_id: savedEmployees.find(e => e.name === "John Doe")?.id },
    { email: 'JaneSmith@gmail.com', password: '2222', employee_id: savedEmployees.find(e => e.name === "Jane Smith")?.id },
    { email: 'JohnSmith@gmail.com', password: '3333', employee_id: savedEmployees.find(e => e.name === "John Smith")?.id },
  ];
  
  const credentialsRepository = initialAppDataSource.getRepository(EmployeeCredentials);
  const credentials = credentialsRepository.create(employeeCredentialsData);
  await credentialsRepository.save(credentials);

  // Seed Requests

  const requestsData = [
    { employee: savedEmployees[0], start_date: "2024-04-01", end_date: "2024-04-05", status: RequestStatus.Pending },
    { employee: savedEmployees[0], start_date: "2024-03-01", end_date: "2024-03-02", status: RequestStatus.Approved },
    { employee: savedEmployees[1], start_date: "2024-03-02", end_date: "2024-03-03", status: RequestStatus.Rejected },
    { employee: savedEmployees[1], start_date: "2024-03-03", end_date: "2024-03-04", status: RequestStatus.Pending },
  ];

  const requests = initialAppDataSource.getRepository(Request).create(requestsData);
  await initialAppDataSource.getRepository(Request).save(requests);

  console.log("Database seeded successfully");

  await initialAppDataSource.destroy();
}

seedUsers().catch((error) => console.log(error));