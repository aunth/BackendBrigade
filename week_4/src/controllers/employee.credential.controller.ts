import { AppDataSource } from "../database"; 
import { EmployeeCredentials } from "../entity/EmployeeCredential";

class EmployeeCredentialController {

    async getByEmail(email: string) {
        const employeeCredentialRepository = AppDataSource.getRepository(EmployeeCredentials);
        const credentials = await employeeCredentialRepository.findOneBy({ email: email });
        return credentials;
    }

    async saveCode(email:string, code: string) {
        const employeeCredentialRepository = AppDataSource.getRepository(EmployeeCredentials);
        const credentials = await employeeCredentialRepository.findOneBy({ email: email });
        if (credentials) {
            credentials.two_fa_code = code;
            await employeeCredentialRepository.save(credentials);
            console.log(`2FA code updated for ${email}`);
            return true;
        } else {
            console.error(`No credentials found for ${email}`);
            return false;
        }
    }

    async verifyCode(employeeId: string, code: string) {
        const employeeCredentialRepository = AppDataSource.getRepository(EmployeeCredentials);
        const credentials = await employeeCredentialRepository.findOneBy({ employee_id: parseInt(employeeId, 10) });
        if (credentials && credentials.two_fa_code === code) {
            console.log(`2FA code verified for employee ID: ${employeeId}`);
            
            credentials.two_fa_code = null;
            await employeeCredentialRepository.save(credentials);
    
            return {status: true, email: credentials.email};
        } else {
            console.error(`2FA code mismatch or no credentials found for employee ID: ${employeeId}`);
            return false;
        }
    }
}

export const employeeCredentialController = new EmployeeCredentialController();