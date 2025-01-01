import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLatlngAddress1735746864804 implements MigrationInterface {
    name = 'AddLatlngAddress1735746864804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "lat" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "address" ADD "lng" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "lat"`);
    }

}
