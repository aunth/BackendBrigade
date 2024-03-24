import { AppDataSource } from "../database"; 
import { BlackoutPeriod } from "../entity/BlackoutPeriod";

class BlackoutPeriodsController {

    async getBlackoutPeriods(departmentId: number) {
        const blackoutPeriodRepository = AppDataSource.getRepository(BlackoutPeriod);
        const blackoutPeriods = await blackoutPeriodRepository.find({
            select: ['start_date', 'end_date'],
            where: {
                department_id: departmentId
            }
        });
        return blackoutPeriods;
    }
}

export const blackoutPeriodsController = new BlackoutPeriodsController();