-- Rare Collectible Auction House demo data
-- Assumes schema/migrations already applied.
-- Wipes existing rows and inserts deterministic demo content.

BEGIN;

SET TIME ZONE 'UTC';

TRUNCATE TABLE
  payments,
  disputes,
  notifications,
  messages,
  bids,
  auction_images,
  auctions,
  users
RESTART IDENTITY CASCADE;

-- All demo accounts use password: 123456
-- bcrypt hash (cost=10) for "123456":
-- $2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa

INSERT INTO users (
  id, email, password_hash, role, display_name, contact_phone, preferences_json, is_active,
  created_at, updated_at, deleted_at
) VALUES
  (1, 'admin@rare-collectibles.local', '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'ADMIN', 'Platform Administrator', NULL, '{"seed":"demo"}'::jsonb, true, '2026-04-01T09:00:00Z', '2026-04-01T09:00:00Z', NULL),
  (2, 'seller.comics@demo.local',        '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Metro Comics Vault',     '+1 212 555 0134', '{"favoriteCategories":["Comics"]}'::jsonb, true, '2026-04-02T10:00:00Z', '2026-04-06T10:00:00Z', NULL),
  (3, 'seller.cards@demo.local',         '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Card Conservatory',     '+1 617 555 0198', '{"favoriteCategories":["Cards","Sports Cards"]}'::jsonb, true, '2026-04-02T10:30:00Z', '2026-04-06T10:30:00Z', NULL),
  (4, 'seller.watches@demo.local',       '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Harbor Watch Co.',      '+44 20 7946 0990', '{"preferredCurrency":"GBP"}'::jsonb, true, '2026-04-02T11:00:00Z', '2026-04-06T11:00:00Z', NULL),
  (5, 'seller.tech@demo.local',          '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Vintage Silicon',       '+1 650 555 0123', '{"favoriteCategories":["Technology"]}'::jsonb, true, '2026-04-02T11:30:00Z', '2026-04-06T11:30:00Z', NULL),
  (6, 'seller.art@demo.local',           '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Museum Private Sales',  '+49 30 5550 0101', '{"favoriteCategories":["Art","Antiques"]}'::jsonb, true, '2026-04-02T12:00:00Z', '2026-04-06T12:00:00Z', NULL),
  (7, 'buyer.aria@demo.local',           '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Aria Nguyen',           NULL, '{"outbidAlerts":true}'::jsonb, true, '2026-04-03T09:10:00Z', '2026-04-07T09:10:00Z', NULL),
  (8, 'buyer.miles@demo.local',          '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Miles Carter',          NULL, '{"weeklyDigest":true}'::jsonb, true, '2026-04-03T09:20:00Z', '2026-04-07T09:20:00Z', NULL),
  (9, 'buyer.zara@demo.local',           '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Zara Patel',            NULL, '{"favoriteCategories":["Watches"]}'::jsonb, true, '2026-04-03T09:30:00Z', '2026-04-07T09:30:00Z', NULL),
  (10,'buyer.noah@demo.local',           '$2b$10$5BODte/mDtFR2PlfX7FLH.Ji5Q.bt2bi1POxmvCysmeVBKs.U/nBa', 'USER',  'Noah Johnson',          NULL, '{"favoriteCategories":["Technology","Comics"]}'::jsonb, true, '2026-04-03T09:40:00Z', '2026-04-07T09:40:00Z', NULL);

-- Auctions
INSERT INTO auctions (
  id, seller_id, title, description, category, item_condition, status,
  starts_at, ends_at, starting_price, reserve_price, provenance, location, shipping_notes,
  current_high_bid_id, winning_bid_id,
  created_at, updated_at, deleted_at
) VALUES
  (
    1, 3,
    'T206 Honus Wagner (1909-1911) - Burdick Collection Reference',
    'Reference-grade example of the famous T206 Honus Wagner card. Includes detailed close-ups and provenance notes. Intended for serious collectors; insured shipping and signature required.',
    'Sports Cards', 'Vintage tobacco card (see photos)', 'ENDED',
    '2026-03-18T14:00:00Z', '2026-03-28T18:00:00Z', 500000.00, 1000000.00,
    'Photographic reproduction sourced from the Metropolitan Museum of Art (Jefferson R. Burdick Collection).',
    'New York, USA', 'Insured shipping. Adult signature required. International shipping on request.',
    NULL, NULL,
    '2026-03-10T12:00:00Z', '2026-03-28T18:10:00Z', NULL
  ),
  (
    2, 2,
    'Action Comics #1 (1938) - CGC 9.0 showcase (demo listing)',
    'Showcase listing for an iconic Golden Age comic. Includes slab photos and event documentation. Use messaging to request additional documentation and logistics.',
    'Comics', 'Slabbed CGC 9.0 (showcase photos)', 'ACTIVE',
    '2026-04-05T10:00:00Z', '2026-04-20T20:00:00Z', 2000000.00, 3000000.00,
    'Event photo of a CGC 9.0 copy displayed by Metropolis Collectibles (New York Comic Con).',
    'Los Angeles, USA', 'Armored shipping. Bank wire only. Local pickup available.',
    NULL, NULL,
    '2026-04-05T09:55:00Z', '2026-04-10T11:00:00Z', NULL
  ),
  (
    3, 4,
    'Rolex Submariner Date 16610 (1989-2010) - Full set',
    'Classic Submariner Date 16610 with clean dial and bezel. Includes box/papers (see images). Recently serviced; timegrapher results available on request.',
    'Watches', 'Excellent pre-owned; serviced', 'ACTIVE',
    '2026-04-08T09:00:00Z', '2026-04-18T19:30:00Z', 6500.00, NULL,
    'Seller-provided photos; full set documented in listing.',
    'London, United Kingdom', 'Tracked and insured shipping included in UK. EU/US shipping quoted via messages.',
    NULL, NULL,
    '2026-04-08T08:45:00Z', '2026-04-10T12:30:00Z', NULL
  ),
  (
    4, 5,
    'Apple I Computer (1976) - museum display unit (demo)',
    'Apple I computer photographed at the Science Museum. Demo listing that simulates a high-value technology auction with bidding, messaging, disputes, and payments.',
    'Technology', 'Vintage computer (museum documented)', 'ENDED',
    '2026-03-22T10:00:00Z', '2026-04-01T18:00:00Z', 100000.00, 200000.00,
    'Photographed Apple I at the Science Museum; used here for demo purposes with clear attribution.',
    'San Jose, USA', 'Escrow recommended. Insured freight shipping.',
    NULL, NULL,
    '2026-03-20T08:00:00Z', '2026-04-01T18:05:00Z', NULL
  ),
  (
    5, 6,
    'Stradivarius Violin (1703) - museum reference photos (draft)',
    'Draft listing using reference photos of a 1703 Stradivarius violin (profile/back) from the Musikinstrumenten Museum, Berlin. Kept as a draft to demonstrate seller workflows.',
    'Instruments', 'Museum reference photos', 'DRAFT',
    '2026-04-25T10:00:00Z', '2026-05-05T18:00:00Z', 2500000.00, NULL,
    'Photos credited to Hay Kranen / CC-BY (museum documentation).',
    'Berlin, Germany', 'White-glove logistics and escrow required.',
    NULL, NULL,
    '2026-04-06T10:00:00Z', '2026-04-10T10:00:00Z', NULL
  ),
  (
    6, 6,
    'Faberge egg (replica) - detailed photos and condition notes',
    'Replica Faberge egg with detailed photography. Demonstrates an ended auction without a winning bidder due to reserve not being met.',
    'Antiques', 'Excellent display condition (replica)', 'ENDED',
    '2026-03-25T12:00:00Z', '2026-04-02T16:00:00Z', 15000.00, 50000.00,
    'Seller-provided photos; replica attributed in listing.',
    'St. Petersburg, Russia', 'Insured shipping; customs paperwork handled by seller.',
    NULL, NULL,
    '2026-03-20T12:00:00Z', '2026-04-02T16:02:00Z', NULL
  );

-- Auction images (Wikimedia Commons Special:FilePath URLs are directly accessible)
INSERT INTO auction_images (id, auction_id, url, sort_order, created_at, deleted_at) VALUES
  (1, 1, 'https://commons.wikimedia.org/wiki/Special:FilePath/Honus%20Wagner%20T206%20from%20Burdick%20Collection.jpg', 0, '2026-03-10T12:05:00Z', NULL),
  (2, 1, 'https://commons.wikimedia.org/wiki/Special:FilePath/Honus%20wagner%20t206%20baseball%20card.jpg', 1, '2026-03-10T12:05:30Z', NULL),

  (3, 2, 'https://commons.wikimedia.org/wiki/Special:FilePath/Action%20comics%201%20cgc%209-point-0%20vincent%20zurzolo.jpg', 0, '2026-04-05T10:05:00Z', NULL),
  (4, 2, 'https://commons.wikimedia.org/wiki/Special:FilePath/Cover%20of%20All%20American%20Comics%201.jpg', 1, '2026-04-05T10:05:30Z', NULL),

  (5, 3, 'https://commons.wikimedia.org/wiki/Special:FilePath/Rolex-Submariner.jpg', 0, '2026-04-08T08:50:00Z', NULL),
  (6, 3, 'https://commons.wikimedia.org/wiki/Special:FilePath/Rolex%20Submariner.JPG', 1, '2026-04-08T08:50:30Z', NULL),

  (7, 4, 'https://commons.wikimedia.org/wiki/Special:FilePath/Apple%20I%20computer.jpg', 0, '2026-03-20T08:05:00Z', NULL),
  (8, 4, 'https://commons.wikimedia.org/wiki/Special:FilePath/Apple%20I%20computer.jpg', 1, '2026-03-20T08:05:30Z', NULL),

  (9, 5, 'https://commons.wikimedia.org/wiki/Special:FilePath/Stradivarius%20violin%20profile.jpg', 0, '2026-04-06T10:05:00Z', NULL),
  (10,5, 'https://commons.wikimedia.org/wiki/Special:FilePath/Stradivarius%20violin%20back.jpg', 1, '2026-04-06T10:05:30Z', NULL),

  (11,6, 'https://commons.wikimedia.org/wiki/Special:FilePath/5893.4._Faberg%C3%A9_egg.jpg', 0, '2026-03-20T12:05:00Z', NULL),
  (12,6, 'https://commons.wikimedia.org/wiki/Special:FilePath/Napoleonic%202%20(Faberg%C3%A9%20egg).jpg', 1, '2026-03-20T12:05:30Z', NULL);

-- Bids
INSERT INTO bids (id, auction_id, bidder_id, amount, created_at, deleted_at) VALUES
  -- Auction 1 (ENDED, reserve met)
  (1, 1, 8, 900000.00,  '2026-03-20T12:10:00Z', NULL),
  (2, 1, 7, 1100000.00, '2026-03-21T15:22:00Z', NULL),
  (3, 1, 8, 1500000.00, '2026-03-25T09:40:00Z', NULL),
  (4, 1, 7, 1750000.00, '2026-03-28T17:55:00Z', NULL),

  -- Auction 2 (ACTIVE)
  (5, 2, 10, 2150000.00, '2026-04-06T11:10:00Z', NULL),
  (6, 2, 8,  2300000.00, '2026-04-08T14:05:00Z', NULL),
  (7, 2, 10, 2500000.00, '2026-04-10T10:45:00Z', NULL),

  -- Auction 3 (ACTIVE)
  (8, 3, 9,  6800.00,   '2026-04-09T09:20:00Z', NULL),
  (9, 3, 7,  7050.00,   '2026-04-10T11:20:00Z', NULL),
  (10,3, 9,  7200.00,   '2026-04-10T12:25:00Z', NULL),

  -- Auction 4 (ENDED, reserve met)
  (11,4, 7,  180000.00, '2026-03-27T18:10:00Z', NULL),
  (12,4, 10, 210000.00, '2026-03-31T20:05:00Z', NULL),
  (13,4, 10, 225000.00, '2026-04-01T17:58:00Z', NULL),

  -- Auction 6 (ENDED, reserve not met)
  (14,6, 8,  22000.00,  '2026-03-29T10:10:00Z', NULL),
  (15,6, 7,  26000.00,  '2026-04-01T12:30:00Z', NULL),
  (16,6, 8,  30000.00,  '2026-04-02T15:40:00Z', NULL);

-- Wire high bid pointers (for deterministic demo state)
UPDATE auctions SET current_high_bid_id = 4,  winning_bid_id = 4  WHERE id = 1;
UPDATE auctions SET current_high_bid_id = 7,  winning_bid_id = NULL WHERE id = 2;
UPDATE auctions SET current_high_bid_id = 10, winning_bid_id = NULL WHERE id = 3;
UPDATE auctions SET current_high_bid_id = 13, winning_bid_id = 13 WHERE id = 4;
UPDATE auctions SET current_high_bid_id = NULL, winning_bid_id = NULL WHERE id = 5;
UPDATE auctions SET current_high_bid_id = 16, winning_bid_id = NULL WHERE id = 6;

-- Messages (realistic buyer/seller threads)
INSERT INTO messages (id, auction_id, sender_id, recipient_id, body, created_at, deleted_at) VALUES
  (1, 1, 7, 3,  'Hi, can you confirm how the item will be packed and shipped? I would also like an invoice with the provenance notes.', '2026-03-25T10:05:00Z', NULL),
  (2, 1, 3, 7,  'Absolutely. We ship in a rigid slab mailer inside a double-box with insurance. We can include an itemized invoice and a provenance summary.', '2026-03-25T10:18:00Z', NULL),
  (3, 1, 7, 3,  'Great. If I win, I will need delivery to a business address with signature required.', '2026-03-25T10:25:00Z', NULL),
  (4, 3, 9, 4,  'Do you have service paperwork for the 16610 and can you share the serial range (partial is fine)?', '2026-04-10T12:40:00Z', NULL),
  (5, 3, 4, 9,  'Yes, service receipt is included and I can share the first/last digits via message once you confirm your intent to bid. Timegrapher results are available too.', '2026-04-10T12:52:00Z', NULL),
  (6, 4, 10,5,  'For the Apple I demo listing: can you clarify what is included (board only vs. full kit) and how you handle escrow?', '2026-03-31T21:10:00Z', NULL),
  (7, 4, 5, 10, 'This is a demo listing. In a real sale we would recommend escrow and a documented chain-of-custody shipping process.', '2026-03-31T21:22:00Z', NULL);

-- Notifications
INSERT INTO notifications (
  id, user_id, type, title, body, payload_json, auction_id, read_at, created_at, deleted_at
) VALUES
  (1, 7,  'AUCTION_WON',     'You won "T206 Honus Wagner (1909-1911) - Burdick Collection Reference"', 'The auction has ended and your bid of 1750000.00 is the winner.', '{"auctionId":1,"winningBidId":4,"amount":1750000}'::jsonb, 1, NULL, '2026-03-28T18:10:00Z', NULL),
  (2, 3,  'AUCTION_ENDED',   'Auction ended: "T206 Honus Wagner (1909-1911) - Burdick Collection Reference"', 'Aria Nguyen won the auction with a bid of 1750000.00.', '{"auctionId":1,"winningBidId":4,"winnerUserId":7,"amount":1750000}'::jsonb, 1, NULL, '2026-03-28T18:10:00Z', NULL),
  (3, 8,  'OUTBID',          'You were outbid on "T206 Honus Wagner (1909-1911) - Burdick Collection Reference"', 'A higher bid was placed. Consider increasing your bid if you want to stay in the lead.', '{"auctionId":1,"previousBidId":3,"newBidId":4}'::jsonb, 1, '2026-03-28T20:00:00Z', '2026-03-28T18:00:00Z', NULL),
  (4, 4,  'NEW_MESSAGE',     'New message about "Rolex Submariner Date 16610 (1989-2010) - Full set"', 'You received a message from Zara Patel.', '{"auctionId":3,"messageId":4}'::jsonb, 3, NULL, '2026-04-10T12:40:00Z', NULL),
  (5, 9,  'NEW_MESSAGE',     'New message about "Rolex Submariner Date 16610 (1989-2010) - Full set"', 'You received a reply from Harbor Watch Co..', '{"auctionId":3,"messageId":5}'::jsonb, 3, NULL, '2026-04-10T12:52:00Z', NULL),
  (6, 10, 'OUTBID',          'You were outbid on "Action Comics #1 (1938) - CGC 9.0 showcase (demo listing)"', 'Another user placed a higher bid.', '{"auctionId":2,"previousBidId":6,"newBidId":7}'::jsonb, 2, NULL, '2026-04-10T10:45:10Z', NULL),

  (7, 10, 'AUCTION_WON',     'You won "Apple I Computer (1976) - museum display unit (demo)"', 'The auction has ended and your bid of 225000.00 is the winner.', '{"auctionId":4,"winningBidId":13,"amount":225000}'::jsonb, 4, '2026-04-02T09:00:00Z', '2026-04-01T18:05:00Z', NULL),
  (8, 5,  'AUCTION_ENDED',   'Auction ended: "Apple I Computer (1976) - museum display unit (demo)"', 'Noah Johnson won the auction with a bid of 225000.00.', '{"auctionId":4,"winningBidId":13,"winnerUserId":10,"amount":225000}'::jsonb, 4, NULL, '2026-04-01T18:05:00Z', NULL),

  (9, 2,  'DISPUTE_OPENED',  'Dispute opened for "Apple I Computer (1976) - museum display unit (demo)"', 'Seller requested review of payment timing and delivery logistics.', '{"auctionId":4,"disputeId":2}'::jsonb, 4, NULL, '2026-04-02T12:10:00Z', NULL),
  (10,10, 'DISPUTE_RESOLVED','Dispute updated for "Apple I Computer (1976) - museum display unit (demo)"', 'Admin decision: favour buyer. Seller to provide updated delivery window and escrow details.', '{"auctionId":4,"disputeId":2,"status":"RESOLVED","resolution":"FAVOUR_BUYER"}'::jsonb, 4, NULL, '2026-04-03T09:00:00Z', NULL),
  (11,5,  'DISPUTE_RESOLVED','Dispute updated for "Apple I Computer (1976) - museum display unit (demo)"', 'Admin decision: favour buyer. Seller to provide updated delivery window and escrow details.', '{"auctionId":4,"disputeId":2,"status":"RESOLVED","resolution":"FAVOUR_BUYER"}'::jsonb, 4, NULL, '2026-04-03T09:00:00Z', NULL),
  (12,2,  'DISPUTE_RESOLVED','Dispute updated for "Apple I Computer (1976) - museum display unit (demo)"', 'Admin decision: favour buyer. Seller to provide updated delivery window and escrow details.', '{"auctionId":4,"disputeId":2,"status":"RESOLVED","resolution":"FAVOUR_BUYER"}'::jsonb, 4, NULL, '2026-04-03T09:00:00Z', NULL),

  (13,3,  'DISPUTE_OPENED',  'Dispute opened for "T206 Honus Wagner (1909-1911) - Burdick Collection Reference"', 'Buyer requested additional provenance confirmation.', '{"auctionId":1,"disputeId":1}'::jsonb, 1, NULL, '2026-03-29T10:00:00Z', NULL),
  (14,7,  'DISPUTE_OPENED',  'Dispute opened for "T206 Honus Wagner (1909-1911) - Burdick Collection Reference"', 'Buyer requested additional provenance confirmation.', '{"auctionId":1,"disputeId":1}'::jsonb, 1, NULL, '2026-03-29T10:00:00Z', NULL);

-- Disputes
INSERT INTO disputes (
  id, auction_id, raised_by_user_id, description, evidence_url, status,
  resolution, resolution_notes, resolved_by_admin_id, resolved_at,
  created_at, updated_at, deleted_at
) VALUES
  (
    1, 1, 7,
    'After the auction ended, I want confirmation that the provenance text shown in the listing will be included with the invoice and shipment. Please attach the specific source reference.',
    'https://commons.wikimedia.org/wiki/File:Honus_Wagner_T206_from_Burdick_Collection.jpg',
    'OPEN',
    NULL, NULL, NULL, NULL,
    '2026-03-29T09:55:00Z', '2026-03-29T09:55:00Z', NULL
  ),
  (
    2, 4, 5,
    'Buyer requested accelerated delivery; we need admin guidance on expected shipping window and escrow process for high-value tech items.',
    'https://commons.wikimedia.org/wiki/File:Apple_I_computer.jpg',
    'RESOLVED',
    'FAVOUR_BUYER',
    'Admin decision: favour buyer. Seller to provide updated delivery window and escrow details.',
    1, '2026-04-03T09:00:00Z',
    '2026-04-02T12:05:00Z', '2026-04-03T09:00:00Z', NULL
  );

-- Payments (admin can view ended auction amounts)
INSERT INTO payments (
  id, auction_id, payer_user_id, payee_user_id, amount, currency, status, external_reference,
  created_at, updated_at, deleted_at
) VALUES
  (1, 1, 7,  3,  1750000.00, 'GBP', 'PENDING', NULL, '2026-03-28T18:11:00Z', '2026-03-28T18:11:00Z', NULL),
  (2, 4, 10, 5,   225000.00, 'GBP', 'PENDING', NULL, '2026-04-01T18:06:00Z', '2026-04-01T18:06:00Z', NULL);

-- Ensure sequences match the inserted ids (important after RESTART IDENTITY + explicit ids)
SELECT setval(pg_get_serial_sequence('users','id'), (SELECT COALESCE(MAX(id), 1) FROM users), true);
SELECT setval(pg_get_serial_sequence('auctions','id'), (SELECT COALESCE(MAX(id), 1) FROM auctions), true);
SELECT setval(pg_get_serial_sequence('auction_images','id'), (SELECT COALESCE(MAX(id), 1) FROM auction_images), true);
SELECT setval(pg_get_serial_sequence('bids','id'), (SELECT COALESCE(MAX(id), 1) FROM bids), true);
SELECT setval(pg_get_serial_sequence('messages','id'), (SELECT COALESCE(MAX(id), 1) FROM messages), true);
SELECT setval(pg_get_serial_sequence('notifications','id'), (SELECT COALESCE(MAX(id), 1) FROM notifications), true);
SELECT setval(pg_get_serial_sequence('disputes','id'), (SELECT COALESCE(MAX(id), 1) FROM disputes), true);
SELECT setval(pg_get_serial_sequence('payments','id'), (SELECT COALESCE(MAX(id), 1) FROM payments), true);

COMMIT;
