import { AppDataSource } from "../database";
import { Department } from "../entity/Department";
import { DepartmentSQL } from "../types/types";


class DepartmentController {

    async getDepartmentById(departmentId: number): Promise < DepartmentSQL > {
        try {
            const departmentRepository = AppDataSource.getRepository(Department);
            const department = await departmentRepository.findOneBy({ id: departmentId });
            return department as DepartmentSQL;
        } catch(error) {
            throw error; 
        }
    }

    async getDepartmentId(departmentName:string | undefined){
        try {
            const departmentRepository = AppDataSource.getRepository(Department);
            const department = await departmentRepository.findOneBy({ name: departmentName });
            if (department) {
                return department.id
            } else {
                return null;
            }
        } catch(error) {
            throw error; 
        }
    }
}

export const departmentController = new DepartmentController();