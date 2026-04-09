import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuctionStatus } from '../../database/enums/auction-status.enum';
import {
  Auction,
  AuctionImage,
  Notification,
  Payment,
} from '../../database/entities';
import { AuctionsService } from './auctions.service';

function buildAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    id: 7,
    title: 'First appearance signed comic',
    description: 'A graded comic with supporting certification and provenance.',
    category: 'Comics',
    itemCondition: 'Near mint',
    status: AuctionStatus.Draft,
    startsAt: new Date('2026-05-01T10:00:00.000Z'),
    endsAt: new Date('2026-05-07T10:00:00.000Z'),
    startingPrice: 125,
    reservePrice: 180,
    provenance: 'Signed and slabbed with certificate.',
    location: 'Manchester, United Kingdom',
    shippingNotes: 'Tracked and insured shipping included.',
    createdAt: new Date('2026-04-01T10:00:00.000Z'),
    updatedAt: new Date('2026-04-02T10:00:00.000Z'),
    deletedAt: null,
    seller: {
      id: 14,
      email: 'seller@example.com',
      passwordHash: 'hash',
      role: undefined,
      displayName: 'Collector Loft',
      contactPhone: null,
      preferencesJson: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    currentHighBid: null,
    winningBid: null,
    images: [
      {
        id: 3,
        url: 'https://example.com/comic.jpg',
        sortOrder: 0,
        createdAt: new Date('2026-04-01T10:00:00.000Z'),
        deletedAt: null,
        auction: {} as Auction,
      } as AuctionImage,
    ],
    bids: [],
    ...overrides,
  } as Auction;
}

describe('AuctionsService', () => {
  let service: AuctionsService;

  const auctionsRepo = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    softRemove: jest.fn(),
  };

  const auctionImagesRepo = {
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const notificationsRepo = {
    save: jest.fn(),
    create: jest.fn(),
  };

  const paymentsRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    auctionsRepo.find.mockResolvedValue([]);
    paymentsRepo.findOne.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: getRepositoryToken(Auction),
          useValue: auctionsRepo,
        },
        {
          provide: getRepositoryToken(AuctionImage),
          useValue: auctionImagesRepo,
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: notificationsRepo,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: paymentsRepo,
        },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
  });

  it('hides draft auctions from the public detail endpoint', async () => {
    auctionsRepo.findOne.mockResolvedValue(buildAuction({ status: AuctionStatus.Draft }));

    await expect(service.getPublicAuction(7)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('prevents deleting active auctions', async () => {
    auctionsRepo.findOne.mockResolvedValue(buildAuction({ status: AuctionStatus.Active }));

    await expect(service.deleteAuction(14, 7)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('publishes a seller auction and returns a safe response shape', async () => {
    auctionsRepo.findOne
      .mockResolvedValueOnce(buildAuction({ status: AuctionStatus.Draft }))
      .mockResolvedValueOnce(buildAuction({ status: AuctionStatus.Active }));
    auctionsRepo.save.mockImplementation(async (auction: Auction) => auction);

    const result = await service.publishAuction(14, 7);

    expect(auctionsRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: AuctionStatus.Active }),
    );
    expect(result.status).toBe(AuctionStatus.Active);
    expect(result.seller).toEqual({
      id: 14,
      displayName: 'Collector Loft',
    });
    expect((result as { seller: { passwordHash?: string } }).seller.passwordHash).toBeUndefined();
  });

  it('settles ended auctions and stores the winning bid', async () => {
    const winningBid = {
      id: 44,
      amount: 250,
      bidder: {
        id: 18,
        displayName: 'Winning Bidder',
      },
    };

    auctionsRepo.find.mockResolvedValue([
      buildAuction({
        status: AuctionStatus.Active,
        endsAt: new Date('2020-01-01T00:00:00.000Z'),
        currentHighBid: winningBid as Auction['currentHighBid'],
      }),
    ]);
    auctionsRepo.save.mockImplementation(async (auction: Auction) => auction);
    notificationsRepo.create.mockImplementation((payload) => payload);
    notificationsRepo.save.mockResolvedValue(undefined);
    paymentsRepo.create.mockImplementation((payload) => payload);
    paymentsRepo.save.mockResolvedValue(undefined);

    await service.settleExpiredAuctions();

    expect(auctionsRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: AuctionStatus.Ended,
        winningBid,
      }),
    );
    expect(notificationsRepo.save).toHaveBeenCalled();
    expect(paymentsRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 250 }),
    );
  });
});
