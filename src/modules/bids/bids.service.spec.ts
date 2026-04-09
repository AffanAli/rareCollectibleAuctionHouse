import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { AuctionStatus } from '../../database/enums/auction-status.enum';
import { Auction, Bid, Notification } from '../../database/entities';
import { BidsService } from './bids.service';

function buildAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    id: 3,
    title: 'Rare signed football shirt',
    description: 'Signed match-worn shirt with provenance.',
    category: 'Memorabilia',
    itemCondition: 'Excellent',
    status: AuctionStatus.Active,
    startsAt: new Date('2026-04-01T10:00:00.000Z'),
    endsAt: new Date('2026-12-31T10:00:00.000Z'),
    startingPrice: 100,
    reservePrice: 150,
    provenance: null,
    location: 'Leeds',
    shippingNotes: null,
    currentHighBid: null,
    winningBid: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    seller: {
      id: 9,
      email: 'seller@example.com',
      passwordHash: 'hash',
      role: undefined,
      displayName: 'Seller One',
      contactPhone: null,
      preferencesJson: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    images: [],
    bids: [],
    ...overrides,
  } as Auction;
}

function buildBid(overrides: Partial<Bid> = {}): Bid {
  return {
    id: 17,
    amount: 120,
    createdAt: new Date('2026-04-09T12:00:00.000Z'),
    deletedAt: null,
    bidder: {
      id: 12,
      email: 'bidder@example.com',
      passwordHash: 'hash',
      role: undefined,
      displayName: 'Bidder One',
      contactPhone: null,
      preferencesJson: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    auction: {
      id: 3,
      title: 'Rare signed football shirt',
    } as Auction,
    ...overrides,
  } as Bid;
}

describe('BidsService', () => {
  let service: BidsService;

  const bidsRepo = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  const auctionsRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const notificationsRepo = {
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        { provide: getRepositoryToken(Bid), useValue: bidsRepo },
        { provide: getRepositoryToken(Auction), useValue: auctionsRepo },
        { provide: getRepositoryToken(Notification), useValue: notificationsRepo },
      ],
    }).compile();

    service = module.get(BidsService);
  });

  it('rejects bids below the minimum next bid', async () => {
    auctionsRepo.findOne.mockResolvedValue(buildAuction({ currentHighBid: buildBid({ amount: 200 }) }));

    await expect(service.placeBid(15, 3, { amount: 200.5 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects seller self-bidding', async () => {
    auctionsRepo.findOne.mockResolvedValue(buildAuction());

    await expect(service.placeBid(9, 3, { amount: 120 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('places a valid bid and updates the current high bid', async () => {
    const savedBid = buildBid({ id: 88, amount: 125, bidder: { id: 15, displayName: 'Bidder Two' } as Bid['bidder'] });
    auctionsRepo.findOne
      .mockResolvedValueOnce(buildAuction({ currentHighBid: buildBid({ amount: 120, bidder: { id: 12, displayName: 'Bidder One' } as Bid['bidder'] }) }))
      .mockResolvedValueOnce(buildAuction({ currentHighBid: savedBid }));
    bidsRepo.create.mockReturnValue(savedBid);
    bidsRepo.save.mockResolvedValue(savedBid);
    bidsRepo.find.mockResolvedValue([savedBid]);
    auctionsRepo.save.mockResolvedValue(undefined);
    notificationsRepo.create.mockImplementation((payload) => payload);
    notificationsRepo.save.mockResolvedValue(undefined);

    const result = await service.placeBid(15, 3, { amount: 125 });

    expect(auctionsRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ currentHighBid: savedBid }),
    );
    expect(notificationsRepo.save).toHaveBeenCalled();
    expect(result.currentHighBid?.amount).toBe(125);
  });
});
