import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDetailAdmin1736353022467 implements MigrationInterface {
    name = 'AddDetailAdmin1736353022467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" DROP CONSTRAINT "FK_2f819b22c9546820fa8037f48de"`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ALTER COLUMN "warehouseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ADD CONSTRAINT "FK_2f819b22c9546820fa8037f48de" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_warehouse" DROP CONSTRAINT "FK_2f819b22c9546820fa8037f48de"`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ALTER COLUMN "warehouseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ADD CONSTRAINT "FK_2f819b22c9546820fa8037f48de" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" DROP COLUMN "fullName"`);
    }

}
