import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdTypeUuid1735987597261 implements MigrationInterface {
    name = 'ChangeIdTypeUuid1735987597261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_dba55ed826ef26b5b22bd39409b" PRIMARY KEY ("roleId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab40a6f0cd7d3ebfcce082131f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_dba55ed826ef26b5b22bd39409b"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("roleId", "userId")`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_ab40a6f0cd7d3ebfcce082131fd" PRIMARY KEY ("userId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dba55ed826ef26b5b22bd39409"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "roleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("userId", "roleId")`);
        await queryRunner.query(`CREATE INDEX "IDX_ab40a6f0cd7d3ebfcce082131f" ON "user_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dba55ed826ef26b5b22bd39409" ON "user_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dba55ed826ef26b5b22bd39409"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab40a6f0cd7d3ebfcce082131f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_ab40a6f0cd7d3ebfcce082131fd" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "roleId" bigint NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_dba55ed826ef26b5b22bd39409" ON "user_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("roleId", "userId")`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_dba55ed826ef26b5b22bd39409b" PRIMARY KEY ("roleId")`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ab40a6f0cd7d3ebfcce082131f" ON "user_role" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_dba55ed826ef26b5b22bd39409b"`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("userId", "roleId")`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
