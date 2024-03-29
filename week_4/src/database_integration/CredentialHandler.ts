import mongoose, { Document, Types } from 'mongoose';
import { CredentialInterface, CredentialModel, CredentialSchema, EmployeeInterface } from './models';
import { employeeWorker } from './EmployeeWorker';

class CredentialHandler {

    async getCredential() {
        return await CredentialModel.find();
    }

    async insertCredential(data: CredentialInterface): Promise<CredentialInterface | null> {
        try {
            const credential = new CredentialModel(data);
            const newCredential = await credential.save();
            return newCredential;
        } catch (error) {
            console.error('Error inserting credential:', error);
            return null;
        }
    }

    async deleteCredential(credentialId: Types.ObjectId): Promise<boolean> {
        try {
            const result = await CredentialModel.deleteOne({ _id: credentialId });
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting credential:', error);
            return false;
        }
    }

    async verifyCode(employee_id: Types.ObjectId, code: string) {

        const credentials = await CredentialModel.findOne({employee_id});
        console.log(`Credential ${credentials}`);
        if (credentials && credentials.two_fa_code === code) {
            console.log(`2FA code verified for employee ID: ${employee_id}`);
            
            credentials.two_fa_code = code;
            await CredentialModel.updateOne({employee_id}, credentials);
    
            return {status: true, email: credentials.email};
        } else {
            console.error(`2FA code mismatch or no credentials found for employee ID: ${employee_id}`);
            return false;
        }
    }

    async saveCode(email: string, code: string) {
        try {
            console.log('Here');
            const employee = await employeeWorker.getByEmail(email);
            console.log(`Employee ${employee} with ${email} email`);
            if (!employee) {
                console.log(`Employee with email ${email} not found.`);
                return;
            }

            const credentials = await this.getCredential();

            const updatedCredential = await CredentialModel.findOneAndUpdate(
                { email },
                { two_fa_code: code },
                { new: true }
            );

            console.log(`Code ${code} saved for employee with email ${email}`);
            return true;
        } catch (error) {
            console.error('Error saving code:', error);
            return false;
        }
    }

    async updateCredential(credentialId: Types.ObjectId, email: string, password: string): Promise<CredentialInterface | null> {
        try {
            const updatedCredential = await CredentialModel.findByIdAndUpdate(
                credentialId,
                { email, password },
                { new: true }
            );
            return updatedCredential;
        } catch (error) {
            console.error('Error updating credential:', error);
            return null;
        }
    }
}

export const creadentialHandler = new CredentialHandler();
