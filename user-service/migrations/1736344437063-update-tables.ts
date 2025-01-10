import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1736344437063 implements MigrationInterface {
    name = 'UpdateTables1736344437063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "address" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "createdDate"`);
    }

}
