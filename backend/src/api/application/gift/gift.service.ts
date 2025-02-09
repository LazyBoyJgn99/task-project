import { Injectable } from '@nestjs/common';
import { GiftQueryDetailDto, GiftQueryDto, GiftUseDto } from './gift.dto';
import { GiftDomainService } from '@/api/domain/gift/gift.domain.service';
import { GiftAdapter } from './gift.adapter';

@Injectable()
export class GiftService {
  constructor(
    private readonly giftDomainService: GiftDomainService,
    private readonly giftAdapter: GiftAdapter,
  ) {}

  async Use(giftUseDto: GiftUseDto) {
    await this.giftDomainService.Use(giftUseDto.id);
  }

  async Query(giftQueryDto: GiftQueryDto) {
    const giftList = await this.giftDomainService.Query(giftQueryDto.userId);
    return this.giftAdapter.ToVoList(giftList);
  }

  async Detail(giftQueryDetailDto: GiftQueryDetailDto) {
    const gift = await this.giftDomainService.Detail(giftQueryDetailDto.id);
    return this.giftAdapter.ToVo(gift);
  }
}
