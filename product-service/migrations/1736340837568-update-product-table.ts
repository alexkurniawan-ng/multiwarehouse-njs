import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductTable1736340837568 implements MigrationInterface {
    name = 'UpdateProductTable1736340837568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "status" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "description" SET NOT NULL`);
    }

}
