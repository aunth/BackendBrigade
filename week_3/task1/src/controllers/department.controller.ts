import { cache } from "ejs";
import { AppDataSource } from "../database";
import { Department } from "../entity/Department";
import { DepartmentSQL } from "../types/types";
//import { DepartmentValues } from "../types/types";

class DepartmentController {

    //async getDepartmentById(id: number) {
    //    const departmentRepository = AppDataSource.getRepository(Department);
    //    const department = await departmentRepository.findOneBy({ id: id });
//
    //    if (!department) {
    //        throw new Error(`Department with ID ${id} not found.`);
    //    }
    //    
    //    return department;
    //}

    async getDepartmentById(departmentId: number): Promise < DepartmentSQL > {
        try {
            const departmentRepository = AppDataSource.getRepository(Department);
            const department = await departmentRepository.findOneBy({ id: departmentId });
            return department as DepartmentSQL;
        } catch(error) {
            throw error; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }

    async getDepartmentId(departmentName:string){
        try {
            const departmentRepository = AppDataSource.getRepository(Department);
            const department = await departmentRepository.findOneBy({ name: departmentName });
            if (department) {
                return department.id
            } else {
                return null;
            }
        } catch(error) {
            throw error; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }
}

export const departmentController = new DepartmentController();