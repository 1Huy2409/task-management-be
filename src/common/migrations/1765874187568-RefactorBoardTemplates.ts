import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RefactorBoardTemplates1765874187568 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add is_template column to boards table
        await queryRunner.addColumn(
            "boards",
            new TableColumn({
                name: "is_template",
                type: "boolean",
                default: false,
            })
        );

        // Drop foreign keys if any (assuming cascade takes care or manual drop if needed)
        // Usually best to check constraints, but for now dropping table directly.
        await queryRunner.dropTable("board_template_lists", true);
        await queryRunner.dropTable("board_templates", true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove is_template column
        await queryRunner.dropColumn("boards", "is_template");

        // Restore tables (Basic structure restoration)
        // Note: Data is lost unless we backed it up (which we didn't as per instruction)
        // This is just to prevent migration rollback error
        await queryRunner.query(`
            CREATE TABLE "board_templates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "coverUrl" character varying(255),
                "type" "public"."board_templates_type_enum" NOT NULL DEFAULT 'SYSTEM',
                CONSTRAINT "PK_board_templates" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "board_template_lists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying(255) NOT NULL,
                "position" double precision NOT NULL DEFAULT '0',
                "templateId" uuid,
                CONSTRAINT "PK_board_template_lists" PRIMARY KEY ("id"),
                CONSTRAINT "FK_board_template_lists_templateId" FOREIGN KEY ("templateId") REFERENCES "board_templates"("id") ON DELETE CASCADE
            )
        `);
    }

}
