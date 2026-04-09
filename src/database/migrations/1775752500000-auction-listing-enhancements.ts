import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuctionListingEnhancements1775752500000
  implements MigrationInterface
{
  name = 'AuctionListingEnhancements1775752500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD COLUMN "category" character varying(120) NOT NULL DEFAULT 'General',
        ADD COLUMN "item_condition" character varying(120) NOT NULL DEFAULT 'Not specified',
        ADD COLUMN "reserve_price" numeric(12,2),
        ADD COLUMN "provenance" text,
        ADD COLUMN "location" character varying(160) NOT NULL DEFAULT 'Location pending',
        ADD COLUMN "shipping_notes" text;
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_auctions_status_ends_at" ON "auctions" ("status", "ends_at");
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_auctions_category" ON "auctions" ("category");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_auctions_category";`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_auctions_status_ends_at";`,
    );

    await queryRunner.query(`
      ALTER TABLE "auctions"
        DROP COLUMN "shipping_notes",
        DROP COLUMN "location",
        DROP COLUMN "provenance",
        DROP COLUMN "reserve_price",
        DROP COLUMN "item_condition",
        DROP COLUMN "category";
    `);
  }
}
