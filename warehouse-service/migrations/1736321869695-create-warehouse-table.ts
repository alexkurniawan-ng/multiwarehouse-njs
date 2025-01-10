import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWarehouseTable1736321869695 implements MigrationInterface {
    name = 'CreateWarehouseTable1736321869695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_warehouse" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "warehouseId" uuid NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_973a8419090f99089f88e98c3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_journal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mutationType" character varying NOT NULL, "quantity" integer NOT NULL, "inventoryId" uuid NOT NULL, "orderId" character varying, "destinationInventoryId" uuid, "status" character varying NOT NULL, "remarks" character varying, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2087685fb55c29474bcd9c7455" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" character varying NOT NULL, "warehouseId" uuid NOT NULL, "quantity" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "street" character varying NOT NULL, "city" character varying NOT NULL, "province" character varying NOT NULL, "postalCode" character varying NOT NULL, "lat" double precision NOT NULL DEFAULT '0', "lng" double precision NOT NULL DEFAULT '0', "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" ADD CONSTRAINT "FK_2f819b22c9546820fa8037f48de" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_journal" ADD CONSTRAINT "FK_c717a7ff87e779d6be4fc439bc4" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_journal" ADD CONSTRAINT "FK_a98190c062112a52730031f6931" FOREIGN KEY ("destinationInventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_00e0948a0a75d2d5a19bc1106e8" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_00e0948a0a75d2d5a19bc1106e8"`);
        await queryRunner.query(`ALTER TABLE "stock_journal" DROP CONSTRAINT "FK_a98190c062112a52730031f6931"`);
        await queryRunner.query(`ALTER TABLE "stock_journal" DROP CONSTRAINT "FK_c717a7ff87e779d6be4fc439bc4"`);
        await queryRunner.query(`ALTER TABLE "admin_warehouse" DROP CONSTRAINT "FK_2f819b22c9546820fa8037f48de"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "stock_journal"`);
        await queryRunner.query(`DROP TABLE "admin_warehouse"`);
    }

}
