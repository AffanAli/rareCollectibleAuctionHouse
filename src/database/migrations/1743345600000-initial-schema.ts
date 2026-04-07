import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1743345600000 implements MigrationInterface {
  name = 'InitialSchema1743345600000';

  /**
   * @param { QueryRunner } queryRunner - TypeORM query runner.
   * @returns { Promise<void> }
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('USER', 'ADMIN');
      CREATE TYPE "auction_status_enum" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED');
      CREATE TYPE "dispute_status_enum" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');
      CREATE TYPE "dispute_resolution_enum" AS ENUM ('REFUND', 'FAVOUR_BUYER', 'FAVOUR_SELLER', 'NO_ACTION');
      CREATE TYPE "payment_status_enum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'USER',
        "display_name" character varying(255),
        "contact_phone" character varying(64),
        "preferences_json" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "auctions" (
        "id" SERIAL PRIMARY KEY,
        "seller_id" integer NOT NULL,
        "title" character varying(500) NOT NULL,
        "description" text NOT NULL,
        "status" "auction_status_enum" NOT NULL DEFAULT 'DRAFT',
        "starts_at" TIMESTAMPTZ NOT NULL,
        "ends_at" TIMESTAMPTZ NOT NULL,
        "starting_price" numeric(12,2) NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_auctions_seller" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "auction_images" (
        "id" SERIAL PRIMARY KEY,
        "auction_id" integer NOT NULL,
        "url" character varying(2048) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_auction_images_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "bids" (
        "id" SERIAL PRIMARY KEY,
        "auction_id" integer NOT NULL,
        "bidder_id" integer NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_bids_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_bids_bidder" FOREIGN KEY ("bidder_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD "current_high_bid_id" integer,
        ADD "winning_bid_id" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD CONSTRAINT "FK_auctions_current_high_bid" FOREIGN KEY ("current_high_bid_id") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_auctions_winning_bid" FOREIGN KEY ("winning_bid_id") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" SERIAL PRIMARY KEY,
        "auction_id" integer NOT NULL,
        "sender_id" integer NOT NULL,
        "recipient_id" integer,
        "body" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_messages_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_messages_recipient" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "type" character varying(64) NOT NULL,
        "title" character varying(255) NOT NULL,
        "body" text,
        "payload_json" jsonb,
        "auction_id" integer,
        "read_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_notifications_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "disputes" (
        "id" SERIAL PRIMARY KEY,
        "auction_id" integer NOT NULL,
        "raised_by_user_id" integer NOT NULL,
        "description" text NOT NULL,
        "evidence_url" character varying(2048),
        "status" "dispute_status_enum" NOT NULL DEFAULT 'OPEN',
        "resolution" "dispute_resolution_enum",
        "resolution_notes" text,
        "resolved_by_admin_id" integer,
        "resolved_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_disputes_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_disputes_raised_by" FOREIGN KEY ("raised_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_disputes_resolved_by" FOREIGN KEY ("resolved_by_admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" SERIAL PRIMARY KEY,
        "auction_id" integer,
        "payer_user_id" integer NOT NULL,
        "payee_user_id" integer NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "currency" character(3) NOT NULL DEFAULT 'GBP',
        "status" "payment_status_enum" NOT NULL DEFAULT 'PENDING',
        "external_reference" character varying(255),
        "is_deleted" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_payments_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_payments_payer" FOREIGN KEY ("payer_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_payments_payee" FOREIGN KEY ("payee_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_bids_auction_created" ON "bids" ("auction_id", "created_at");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_notifications_user" ON "notifications" ("user_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_messages_auction" ON "messages" ("auction_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auctions_seller" ON "auctions" ("seller_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_disputes_auction" ON "disputes" ("auction_id");`,
    );
  }

  /**
   * @param { QueryRunner } queryRunner - TypeORM query runner.
   * @returns { Promise<void> }
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_disputes_auction";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_auctions_seller";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_auction";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_notifications_user";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bids_auction_created";`);

    await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "disputes" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "messages" CASCADE;`);

    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_winning_bid";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_current_high_bid";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP COLUMN IF EXISTS "winning_bid_id";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP COLUMN IF EXISTS "current_high_bid_id";`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "bids" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "auction_images" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "auctions" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);

    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "dispute_resolution_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "dispute_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "auction_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum";`);
  }
}
