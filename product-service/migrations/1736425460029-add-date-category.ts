import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateCategory1736425460029 implements MigrationInterface {
    name = 'AddDateCategory1736425460029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdDate"`);
    }

}
