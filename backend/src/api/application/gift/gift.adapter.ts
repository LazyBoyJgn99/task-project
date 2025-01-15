import { Injectable } from '@nestjs/common';
import { Gift } from '@/api/domain/gift/gift.entity';
import { GiftVo } from './gift.dto';
import { UserAdapter } from '../user/user.adapter';

@Injectable()
export class GiftAdapter {
  constructor(private readonly userAdapter: UserAdapter) {}

  ToVo(gift: Gift) {
    const giftVo = new GiftVo();
    giftVo.id = gift.id;
    giftVo.name = gift.name;
    giftVo.status = gift.status;
    giftVo.canUseTime = gift.canUseTime;
    giftVo.user = this.userAdapter.ToVo(gift.user);
    return giftVo;
  }

  ToVoList(giftList: Gift[]) {
    return giftList.map((gift) => this.ToVo(gift));
  }
}
