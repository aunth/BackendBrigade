import { AppDataSource } from "../database";
import { Request } from "../entity/Request";
import { HolidayRequest } from "../types/types";


class RequestController {
    async getRequest(id: string) {
        const requestRepository = AppDataSource.getRepository(Request);
        const holidayRequest = await requestRepository.findOneBy({ id: parseInt(id, 10) });
        return holidayRequest;
    }

    async getAllRequests() {
        const requestRepository = AppDataSource.getRepository(Request);
        try {
            const holidayRequests = await requestRepository.find()
            return holidayRequests;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getEmployeeRequests(employeeId: number) {
        const requestRepository = AppDataSource.getRepository(Request);
        try {
            const employeeRequests = await requestRepository.findBy({ employee_id: employeeId });
            return employeeRequests;
        } catch (error) {
            throw error;
        }
    }

    async createRequest(newRequest: HolidayRequest) {
        const requestRepository = AppDataSource.getRepository(Request);
        try {
            await requestRepository.save(newRequest);
            console.log('Request created successfully.');
        } catch (error) {
            console.error('Error creating request:', error);
        }
    }

    async updateHolidayRequest(requestId: string, updatedRequest: Partial<HolidayRequest>) {
        const requestRepository = AppDataSource.getRepository(Request);
        try {
            let requestToUpdate = await requestRepository.findOneBy({ id: parseInt(requestId, 10) });
            if (!requestToUpdate) {
                console.error(`Request with ID ${requestId} not found.`);
                return null;
            }
            requestRepository.merge(requestToUpdate, updatedRequest);
            return await requestRepository.save(requestToUpdate);
        } catch (error) {
            throw error;
        }
    }

    async updateRequestStatus(action: 'approved' | 'rejected', requestId: string) {
        const requestRepository = AppDataSource.getRepository(Request);
        const requestIdNumber = parseInt(requestId, 10);

        if (!['pending', 'approved', 'rejected'].includes(action)) {
            console.error(`Invalid action: ${action}`);
            return;
        }
    
        try {
            await requestRepository.update(requestIdNumber, { status: action });

            if (action === 'approved') {
                console.log(`Request ${requestId} status updated to approved.`);
            } else {
                console.log(`Request ${requestId} status updated to rejected.`);
            }
        } catch (error) {
            console.error(`Error updating request status for ID ${requestId}:`, error);
        }
    }
    

    async deleteRequest(requestId: number) {
        const requestRepository = AppDataSource.getRepository(Request);
        try {
            const deleteResult = await requestRepository.delete(requestId);
            if (deleteResult.affected === 0) {
                console.error(`Request with ID ${requestId} not found.`);
            } else {
                console.log(`Request ${requestId} deleted successfully.`);
                return true;
            }
        } catch (error) {
            console.error(`Error deleting request with ID ${requestId}:`, error);
        }
    }
}

export const requestController = new RequestController();
