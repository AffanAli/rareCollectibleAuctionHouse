import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Universal soft delete via deleted_at; removes legacy is_deleted flags.
 * Foreign keys use ON DELETE NO ACTION for required refs (app soft-deletes instead of hard-deletes parents).
 * Nullable FKs keep ON DELETE SET NULL for rare physical removals of referenced rows.
 */
export class SoftDeleteAndNoActionFks1743345700000 implements MigrationInterface {
  name = 'SoftDeleteAndNoActionFks1743345700000';

  /**
   * @param { QueryRunner } queryRunner - TypeORM query runner.
   * @returns { Promise<void> }
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "auctions" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "auction_images" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "bids" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "messages" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "notifications" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "disputes" ADD "deleted_at" TIMESTAMPTZ;
      ALTER TABLE "payments" ADD "deleted_at" TIMESTAMPTZ;
    `);

    await queryRunner.query(
      `ALTER TABLE "auctions" DROP COLUMN IF EXISTS "is_deleted";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP COLUMN IF EXISTS "is_deleted";`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN IF EXISTS "is_deleted";`,
    );

    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_current_high_bid";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_winning_bid";`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" DROP CONSTRAINT IF EXISTS "FK_bids_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" DROP CONSTRAINT IF EXISTS "FK_bids_bidder";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_images" DROP CONSTRAINT IF EXISTS "FK_auction_images_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_sender";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_recipient";`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_user";`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "FK_disputes_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "FK_disputes_raised_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "FK_disputes_resolved_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_payer";`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_payee";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_seller";`,
    );

    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD CONSTRAINT "FK_auctions_seller" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "auction_images"
        ADD CONSTRAINT "FK_auction_images_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "bids"
        ADD CONSTRAINT "FK_bids_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_bids_bidder" FOREIGN KEY ("bidder_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD CONSTRAINT "FK_auctions_current_high_bid" FOREIGN KEY ("current_high_bid_id") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_auctions_winning_bid" FOREIGN KEY ("winning_bid_id") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "messages"
        ADD CONSTRAINT "FK_messages_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_messages_recipient" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications"
        ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_notifications_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "disputes"
        ADD CONSTRAINT "FK_disputes_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_disputes_raised_by" FOREIGN KEY ("raised_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_disputes_resolved_by" FOREIGN KEY ("resolved_by_admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "payments"
        ADD CONSTRAINT "FK_payments_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_payments_payer" FOREIGN KEY ("payer_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_payments_payee" FOREIGN KEY ("payee_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
    `);
  }

  /**
   * @param { QueryRunner } queryRunner - TypeORM query runner.
   * @returns { Promise<void> }
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_payee";`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_payer";`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "FK_disputes_resolved_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "FK_disputes_raised_by";`,
    );
    await queryRunner.query(
      `ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "FK_disputes_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_user";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_recipient";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_sender";`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "FK_messages_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_winning_bid";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_current_high_bid";`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" DROP CONSTRAINT IF EXISTS "FK_bids_bidder";`,
    );
    await queryRunner.query(
      `ALTER TABLE "bids" DROP CONSTRAINT IF EXISTS "FK_bids_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_images" DROP CONSTRAINT IF EXISTS "FK_auction_images_auction";`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT IF EXISTS "FK_auctions_seller";`,
    );

    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD CONSTRAINT "FK_auctions_seller" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "auction_images"
        ADD CONSTRAINT "FK_auction_images_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "bids"
        ADD CONSTRAINT "FK_bids_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_bids_bidder" FOREIGN KEY ("bidder_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "auctions"
        ADD CONSTRAINT "FK_auctions_current_high_bid" FOREIGN KEY ("current_high_bid_id") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_auctions_winning_bid" FOREIGN KEY ("winning_bid_id") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "messages"
        ADD CONSTRAINT "FK_messages_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_messages_recipient" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications"
        ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_notifications_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "disputes"
        ADD CONSTRAINT "FK_disputes_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_disputes_raised_by" FOREIGN KEY ("raised_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_disputes_resolved_by" FOREIGN KEY ("resolved_by_admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "payments"
        ADD CONSTRAINT "FK_payments_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_payments_payer" FOREIGN KEY ("payer_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        ADD CONSTRAINT "FK_payments_payee" FOREIGN KEY ("payee_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);

    await queryRunner.query(
      `ALTER TABLE "auctions" ADD "is_deleted" boolean NOT NULL DEFAULT false;`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "is_deleted" boolean NOT NULL DEFAULT false;`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "is_deleted" boolean NOT NULL DEFAULT false;`,
    );

    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "deleted_at";`);
    await queryRunner.query(`ALTER TABLE "disputes" DROP COLUMN "deleted_at";`);
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "deleted_at";`,
    );
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "deleted_at";`);
    await queryRunner.query(`ALTER TABLE "bids" DROP COLUMN "deleted_at";`);
    await queryRunner.query(
      `ALTER TABLE "auction_images" DROP COLUMN "deleted_at";`,
    );
    await queryRunner.query(`ALTER TABLE "auctions" DROP COLUMN "deleted_at";`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at";`);
  }
}
