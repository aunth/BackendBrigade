import mongoose from 'mongoose';
import { Client, QueryResult } from 'pg';
import { EmployeeModel } from './models';
import { Employee } from '../types/types';
import { Types } from 'mongoose';

const dbName = 'HolidayApplication';

export const uri = `mongodb+srv://vlad:Password@cluster0.gya8rrh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export enum DatabaseType {
    MongoDB = 'mongodb',
    PostgreSQL = 'postgresql',
}

export class DBConnector {
    private databaseType: DatabaseType;
    private mongoDBUri: string;
    private pgClient: Client;

    constructor(databaseType: DatabaseType, mongoDBUri: string, pgConnectionString: string) {
        this.databaseType = databaseType;
        this.mongoDBUri = mongoDBUri;
        this.pgClient = new Client({
            connectionString: pgConnectionString,
        });
    }

    async connect() {
        if (this.databaseType === DatabaseType.MongoDB) {
            await mongoose.connect(this.mongoDBUri);
            console.log('Connected to MongoDB');
        } else if (this.databaseType === DatabaseType.PostgreSQL) {
            await this.pgClient.connect();
            console.log('Connected to PostgreSQL');
        }
    }

    async disconnect() {
        if (this.databaseType === DatabaseType.MongoDB) {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } else if (this.databaseType === DatabaseType.PostgreSQL) {
            await this.pgClient.end();
            console.log('Disconnected from PostgreSQL');
        }
    }

    getType() {
        return this.databaseType;
    }
}

export const Connector = new DBConnector(DatabaseType.MongoDB, uri, '');