import { Gift } from '@/api/domain/gift/gift.entity';
import { User } from '@/api/domain/user/user.entity';
import { Injectable } from '@nestjs/common';
import { GiftPo } from './gift.po';

@Injectable()
export class GiftAdapter {
  ToPo(gift: Gift) {
    const giftPo = new GiftPo();
    giftPo.id = gift.id;
    giftPo.name = gift.name;
    giftPo.status = gift.status;
    giftPo.userId = gift.user.id;
    giftPo.canUseTime = gift.canUseTime;
    return giftPo;
  }

  ToEntity(giftPo: GiftPo, user: User) {
    const gift = new Gift();
    gift.id = giftPo.id;
    gift.name = giftPo.name;
    gift.status = giftPo.status;
    gift.user = user;
    gift.canUseTime = giftPo.canUseTime;
    return gift;
  }

  ToEntityList(giftPoList: GiftPo[], user: User) {
    return giftPoList.map((giftPo) => this.ToEntity(giftPo, user));
  }
}
