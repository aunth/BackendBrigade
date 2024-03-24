import mongoose from 'mongoose';
//import { Client, QueryResult } from 'pg';
//import { EmployeeModel } from './models';
//import { Employee } from '../types/types';
//import { Types } from 'mongoose';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../database';

const dbName = 'HolidayApplication';

export const uri = `mongodb+srv://vlad:Password@cluster0.gya8rrh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export enum DatabaseType {
    MongoDB = 'mongodb',
    PostgreSQL = 'postgresql',
}

export class DBConnector {
    private static instance: DBConnector;
    public currentDatabaseType: DatabaseType | null = null;
    private mongoDBUri: string;
    private pgDataSource: DataSource;

    private constructor(mongoDBUri: string, pgDataSource: DataSource) {
        this.mongoDBUri = mongoDBUri;
        this.pgDataSource = pgDataSource;
    }

    public static getInstance(mongoDBUri: string, pgDataSource: DataSource): DBConnector {
        if (!DBConnector.instance) {
            DBConnector.instance = new DBConnector(mongoDBUri, pgDataSource);
        }
        return DBConnector.instance;
    }

    async switchDatabase(databaseType: DatabaseType) {
        if (this.currentDatabaseType === databaseType) {
            console.log(`Already using ${databaseType}`);
            return;
        }

        await this.disconnectCurrentDatabase();

        this.currentDatabaseType = databaseType;

        // Disconnect from all databases first to ensure a clean switch
        //await mongoose.disconnect();
        //await this.pgDataSource.destroy();

        if (databaseType === DatabaseType.MongoDB) {
            await mongoose.connect(this.mongoDBUri);
        } else if (databaseType === DatabaseType.PostgreSQL) {
            await this.pgDataSource.initialize();
        }
    }

    async disconnectCurrentDatabase() {
        if (this.currentDatabaseType === DatabaseType.MongoDB) {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        } else if (this.currentDatabaseType === DatabaseType.PostgreSQL) {
            await this.pgDataSource.destroy();
            console.log('Disconnected from PostgreSQL');
        }
    }
}

export const dbConnector = DBConnector.getInstance(uri, AppDataSource);