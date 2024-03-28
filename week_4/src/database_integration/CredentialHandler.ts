import mongoose, { Document, Types } from 'mongoose';
import { CredentialInterface, CredentialModel, EmployeeInterface } from './models';

class CredentialHandler {

    async insertCredential(data: CredentialInterface): Promise<CredentialInterface | null> {
        try {
            const credential = new CredentialModel({
                _id: new mongoose.Types.ObjectId(),
                employee_id: data.employee_id,
				email: data.email,
				password: data.password
            });
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
