import "reflect-metadata"
import { DataSource } from 'typeorm';
import { Employee } from '../src/entity/Employee';
import { Request } from '../src/entity/Request';
import { Department } from '../src/entity/Department';
import { BlackoutPeriod } from '../src/entity/BlackoutPeriod';
import { EmployeeCredentials } from "./entity/EmployeeCredential";

import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    entities: [Employee, Request, Department, BlackoutPeriod, EmployeeCredentials],
    synchronize: false,
    dropSchema: false,
    logging: false,
    ssl: {
        rejectUnauthorized: true
    },
    migrations: ["src/migrations/*{.ts,.js}"],
});

