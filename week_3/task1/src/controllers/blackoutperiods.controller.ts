import { AppDataSource } from "../database"; 
import { BlackoutPeriod } from "../entity/BlackoutPeriod";

class BlackoutPeriodsController {

    async getBlackoutPeriods(departmentId: number) {
        const blackoutPeriodRepository = AppDataSource.getRepository(BlackoutPeriod);
        const blackoutPeriods = await blackoutPeriodRepository.find({
            select: ['blackout_start_date', 'blackout_end_date'],
            where: {
                department_id: departmentId
            }
        });
        return blackoutPeriods;
    }
}

export const blackoutPeriodsController = new BlackoutPeriodsController();