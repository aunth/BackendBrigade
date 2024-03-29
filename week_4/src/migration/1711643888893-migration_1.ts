import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11711643888893 implements MigrationInterface {
    name = 'Migration11711643888893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_credentials" ADD "two_fa_code" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_credentials" DROP COLUMN "two_fa_code"`);
    }

}
