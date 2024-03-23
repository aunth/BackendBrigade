import "reflect-metadata"
import { DataSource } from 'typeorm';
import path from 'path';
import { Employee } from '../src/entity/Employee';
import { Request } from '../src/entity/Request';
import { Department } from '../src/entity/Department';
import { BlackoutPeriod } from '../src/entity/BlackoutPeriod';

import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    entities: [Employee, Request, Department, BlackoutPeriod],
    //entities: [path.join(__dirname, "entity/**/*.ts")],
    synchronize: false,
    dropSchema: false,
    logging: true,
    //entities: ["./src/entity/**/*{.ts,.js}"],
    migrations: ["src/migrations/*{.ts,.js}"],
});


//AppDataSource.initialize()
//    .then(() => {
//        console.log("Data Source has been initialized!");
//    })
//    .catch((error) => console.error("Error during Data Source initialization:", error));
//

//import { Pool } from 'pg'
//import dotenv from 'dotenv'
//dotenv.config()
//
//export const db: Pool = new Pool({
//    port: Number(process.env.POSTGRESQL_PORT),
//    user: process.env.POSTGRESQL_USER,
//    password: process.env.POSTGRESQL_PASSWORD,
//    host: process.env.POSTGRESQL_HOST,
//    database: process.env.POSTGRESQL_DATABASE
//});

//module.exports = pool;
