import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNullableTable1736347267657 implements MigrationInterface {
    name = 'UpdateNullableTable1736347267657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "street" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "province" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "postalCode" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "postalCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "province" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "street" SET NOT NULL`);
    }

}
