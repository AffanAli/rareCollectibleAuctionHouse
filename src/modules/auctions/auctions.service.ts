import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionStatus } from '../../database/enums/auction-status.enum';
import { Auction, AuctionImage } from '../../database/entities';
import {
  AuctionImageInputDto,
  AuctionListQueryDto,
  CreateAuctionDto,
  UpdateAuctionDto,
} from './dto/create-auction.dto';

type AuctionResponse = {
  id: number;
  title: string;
  description: string;
  category: string;
  itemCondition: string;
  status: AuctionStatus;
  startsAt: Date;
  endsAt: Date;
  startingPrice: number;
  reservePrice: number | null;
  provenance: string | null;
  location: string;
  shippingNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  seller: {
    id: number;
    displayName: string;
  };
  images: Array<{
    id: number;
    url: string;
    sortOrder: number;
  }>;
};

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepo: Repository<Auction>,
    @InjectRepository(AuctionImage)
    private readonly auctionImagesRepo: Repository<AuctionImage>,
  ) {}

  async listPublicAuctions(query: AuctionListQueryDto): Promise<AuctionResponse[]> {
    const builder = this.auctionsRepo
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.images', 'image', 'image.deleted_at IS NULL')
      .leftJoinAndSelect('auction.seller', 'seller')
      .where('auction.deleted_at IS NULL');

    if (query.status) {
      builder.andWhere('auction.status = :status', { status: query.status });
    } else {
      builder.andWhere('auction.status IN (:...statuses)', {
        statuses: [AuctionStatus.Active, AuctionStatus.Ended],
      });
    }

    if (query.q) {
      builder.andWhere(
        '(auction.title ILIKE :q OR auction.description ILIKE :q OR auction.category ILIKE :q)',
        { q: `%${query.q}%` },
      );
    }

    if (query.category) {
      builder.andWhere('auction.category ILIKE :category', {
        category: `%${query.category}%`,
      });
    }

    const auctions = await builder
      .orderBy('auction.endsAt', 'ASC')
      .addOrderBy('image.sortOrder', 'ASC')
      .addOrderBy('image.createdAt', 'ASC')
      .take(24)
      .getMany();

    return auctions.map((auction) => this.toAuctionResponse(auction));
  }

  async getPublicAuction(id: number): Promise<AuctionResponse> {
    const auction = await this.auctionsRepo.findOne({
      where: { id },
      relations: { seller: true, images: true },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status === AuctionStatus.Draft) {
      throw new NotFoundException('Auction not found');
    }

    return this.toAuctionResponse(auction);
  }

  async listSellerAuctions(userId: number): Promise<AuctionResponse[]> {
    const auctions = await this.auctionsRepo.find({
      where: { seller: { id: userId } },
      relations: { seller: true, images: true },
      order: {
        updatedAt: 'DESC',
        images: { sortOrder: 'ASC', createdAt: 'ASC' },
      },
    });

    return auctions
      .filter((auction) => !auction.deletedAt)
      .map((auction) => this.toAuctionResponse(auction));
  }

  async getSellerAuction(userId: number, id: number): Promise<AuctionResponse> {
    const auction = await this.requireSellerAuction(userId, id);
    return this.toAuctionResponse(auction);
  }

  async createAuction(userId: number, dto: CreateAuctionDto): Promise<AuctionResponse> {
    this.validateAuctionWindow(dto.startsAt, dto.endsAt);
    this.validateAuctionStatus(dto.status);

    const auction = await this.auctionsRepo.save(
      this.auctionsRepo.create({
        title: dto.title.trim(),
        description: dto.description.trim(),
        category: dto.category.trim(),
        itemCondition: dto.itemCondition.trim(),
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        startingPrice: dto.startingPrice,
        reservePrice: dto.reservePrice ?? null,
        provenance: dto.provenance?.trim() || null,
        location: dto.location.trim(),
        shippingNotes: dto.shippingNotes?.trim() || null,
        status: dto.status ?? AuctionStatus.Draft,
        seller: { id: userId } as Auction['seller'],
      }),
    );

    await this.replaceAuctionImages(auction, dto.images ?? []);
    return this.getSellerAuction(userId, auction.id);
  }

  async updateAuction(
    userId: number,
    auctionId: number,
    dto: UpdateAuctionDto,
  ): Promise<AuctionResponse> {
    const auction = await this.requireSellerAuction(userId, auctionId);

    if (auction.status === AuctionStatus.Ended) {
      throw new BadRequestException('Ended auctions can no longer be edited');
    }

    const nextStartsAt = dto.startsAt ?? auction.startsAt.toISOString();
    const nextEndsAt = dto.endsAt ?? auction.endsAt.toISOString();
    this.validateAuctionWindow(nextStartsAt, nextEndsAt);
    this.validateAuctionStatus(dto.status);

    auction.title = dto.title?.trim() ?? auction.title;
    auction.description = dto.description?.trim() ?? auction.description;
    auction.category = dto.category?.trim() ?? auction.category;
    auction.itemCondition = dto.itemCondition?.trim() ?? auction.itemCondition;
    auction.startsAt = dto.startsAt ? new Date(dto.startsAt) : auction.startsAt;
    auction.endsAt = dto.endsAt ? new Date(dto.endsAt) : auction.endsAt;
    auction.startingPrice = dto.startingPrice ?? auction.startingPrice;
    auction.reservePrice = dto.reservePrice ?? auction.reservePrice;
    if (dto.provenance !== undefined) {
      auction.provenance = dto.provenance.trim() || null;
    }
    auction.location = dto.location?.trim() ?? auction.location;
    if (dto.shippingNotes !== undefined) {
      auction.shippingNotes = dto.shippingNotes.trim() || null;
    }
    auction.status = dto.status ?? auction.status;

    await this.auctionsRepo.save(auction);

    if (dto.images) {
      await this.replaceAuctionImages(auction, dto.images);
    }

    return this.getSellerAuction(userId, auction.id);
  }

  async publishAuction(userId: number, auctionId: number): Promise<AuctionResponse> {
    const auction = await this.requireSellerAuction(userId, auctionId);
    this.validateAuctionWindow(
      auction.startsAt.toISOString(),
      auction.endsAt.toISOString(),
    );

    if (auction.status === AuctionStatus.Ended) {
      throw new BadRequestException('Ended auctions cannot be republished');
    }

    auction.status = AuctionStatus.Active;
    await this.auctionsRepo.save(auction);
    return this.getSellerAuction(userId, auction.id);
  }

  async cancelAuction(userId: number, auctionId: number): Promise<AuctionResponse> {
    const auction = await this.requireSellerAuction(userId, auctionId);

    if (auction.status === AuctionStatus.Ended) {
      throw new BadRequestException('Ended auctions cannot be cancelled');
    }

    auction.status = AuctionStatus.Cancelled;
    await this.auctionsRepo.save(auction);
    return this.getSellerAuction(userId, auction.id);
  }

  async deleteAuction(userId: number, auctionId: number): Promise<{ deleted: true }> {
    const auction = await this.requireSellerAuction(userId, auctionId);

    if (![AuctionStatus.Draft, AuctionStatus.Cancelled].includes(auction.status)) {
      throw new BadRequestException(
        'Only draft or cancelled auctions can be removed',
      );
    }

    await this.auctionImagesRepo
      .createQueryBuilder()
      .softDelete()
      .where('auction_id = :auctionId', { auctionId })
      .execute();

    await this.auctionsRepo.softRemove(auction);
    return { deleted: true };
  }

  private validateAuctionWindow(startsAt: string, endsAt: string): void {
    const starts = new Date(startsAt);
    const ends = new Date(endsAt);

    if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) {
      throw new BadRequestException('Auction schedule is invalid');
    }

    if (ends <= starts) {
      throw new BadRequestException('Auction end time must be after start time');
    }
  }

  private validateAuctionStatus(status?: AuctionStatus): void {
    if (!status) {
      return;
    }

    if (![AuctionStatus.Draft, AuctionStatus.Active, AuctionStatus.Cancelled].includes(status)) {
      throw new BadRequestException('Auction status is not allowed for seller workflows');
    }
  }

  private async requireSellerAuction(
    userId: number,
    auctionId: number,
  ): Promise<Auction> {
    const auction = await this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: { seller: true, images: true },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.seller.id !== userId) {
      throw new ForbiddenException('You can only manage your own auctions');
    }

    return auction;
  }

  private async replaceAuctionImages(
    auction: Auction,
    images: AuctionImageInputDto[],
  ): Promise<void> {
    await this.auctionImagesRepo
      .createQueryBuilder()
      .softDelete()
      .where('auction_id = :auctionId', { auctionId: auction.id })
      .execute();

    if (images.length === 0) {
      return;
    }

    const imageEntities = images.map((image, index) =>
      this.auctionImagesRepo.create({
        auction,
        url: image.url,
        sortOrder: image.sortOrder ?? index,
      }),
    );

    await this.auctionImagesRepo.save(imageEntities);
  }

  private toAuctionResponse(auction: Auction): AuctionResponse {
    return {
      id: auction.id,
      title: auction.title,
      description: auction.description,
      category: auction.category,
      itemCondition: auction.itemCondition,
      status: auction.status,
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      startingPrice: auction.startingPrice,
      reservePrice: auction.reservePrice,
      provenance: auction.provenance,
      location: auction.location,
      shippingNotes: auction.shippingNotes,
      createdAt: auction.createdAt,
      updatedAt: auction.updatedAt,
      seller: {
        id: auction.seller.id,
        displayName: auction.seller.displayName || `Seller #${auction.seller.id}`,
      },
      images: (auction.images ?? [])
        .filter((image) => !image.deletedAt)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        .map((image) => ({
          id: image.id,
          url: image.url,
          sortOrder: image.sortOrder,
        })),
    };
  }
}
