import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChecklistEntities1766593487909 implements MigrationInterface {
    name = 'CreateChecklistEntities1766593487909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "checklist_items" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "isChecked" boolean NOT NULL DEFAULT false, "checklistId" uuid NOT NULL, "position" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_bae00945a1d4789bd648e583e29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checklists" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "cardId" uuid NOT NULL, CONSTRAINT "PK_336ade2047f3d713e1afa20d2c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "checklist_items" ADD CONSTRAINT "FK_318b40686e72c5ede465984cf9e" FOREIGN KEY ("checklistId") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checklists" ADD CONSTRAINT "FK_6566291e6dfb3ad455ab58cf91f" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checklists" DROP CONSTRAINT "FK_6566291e6dfb3ad455ab58cf91f"`);
        await queryRunner.query(`ALTER TABLE "checklist_items" DROP CONSTRAINT "FK_318b40686e72c5ede465984cf9e"`);
        await queryRunner.query(`DROP TABLE "checklists"`);
        await queryRunner.query(`DROP TABLE "checklist_items"`);
    }

}
