import { MigrationInterface, QueryRunner } from "typeorm";

export class ParentCategoryCanNull1736328333736 implements MigrationInterface {
    name = 'ParentCategoryCanNull1736328333736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "parentCategoryId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "parentCategoryId" SET NOT NULL`);
    }

}
