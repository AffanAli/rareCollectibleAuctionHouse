import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { Auction, Message, Notification } from '../../database/entities';
import { MessagesService } from './messages.service';

function buildAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    id: 5,
    title: 'Vintage racing jacket',
    description: 'Collector-grade vintage jacket.',
    category: 'Fashion',
    itemCondition: 'Excellent',
    status: undefined,
    startsAt: new Date(),
    endsAt: new Date(),
    startingPrice: 100,
    reservePrice: null,
    provenance: null,
    location: 'Bristol',
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

describe('MessagesService', () => {
  let service: MessagesService;

  const messagesRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const auctionsRepo = {
    findOne: jest.fn(),
  };

  const notificationsRepo = {
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useValue: messagesRepo },
        { provide: getRepositoryToken(Auction), useValue: auctionsRepo },
        { provide: getRepositoryToken(Notification), useValue: notificationsRepo },
      ],
    }).compile();

    service = module.get(MessagesService);
  });

  it('allows a buyer to message the seller', async () => {
    const savedMessage = {
      id: 1,
      body: 'Is the original tag included?',
      createdAt: new Date(),
      deletedAt: null,
      auction: { id: 5, title: 'Vintage racing jacket' },
      sender: { id: 12, displayName: 'Buyer One' },
      recipient: { id: 9, displayName: 'Seller One' },
    };

    auctionsRepo.findOne.mockResolvedValue(buildAuction());
    messagesRepo.create.mockReturnValue(savedMessage);
    messagesRepo.save.mockResolvedValue(savedMessage);
    messagesRepo.findOne.mockResolvedValue(savedMessage);
    notificationsRepo.create.mockImplementation((payload) => payload);
    notificationsRepo.save.mockResolvedValue(undefined);

    const result = await service.sendMessage(12, 5, {
      body: 'Is the original tag included?',
    });

    expect(result.recipient?.id).toBe(9);
    expect(notificationsRepo.save).toHaveBeenCalled();
  });

  it('prevents seller replies without an existing thread', async () => {
    auctionsRepo.findOne.mockResolvedValue(buildAuction());
    messagesRepo.findOne.mockResolvedValue(null);

    await expect(
      service.sendMessage(9, 5, {
        recipientId: 12,
        body: 'Thanks for your interest.',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
