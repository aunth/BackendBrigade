import { AppDataSource } from "../database";
import { Department } from "../entity/Department";

class DepartmentController {

    async getDepartmentById(id: number) {
        const departmentRepository = AppDataSource.getRepository(Department);
        const department = await departmentRepository.findOneBy({ id: id });

        if (!department) {
            throw new Error(`Department with ID ${id} not found.`);
        }
        
        return department;
    }
}

export const departmentController = new DepartmentController();