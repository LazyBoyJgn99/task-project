import { Injectable } from '@nestjs/common';
import { User } from '@/api/domain/user/user.entity';
import { UserPo } from './user.po';
import { NewDate } from '@/utils/time';

@Injectable()
export class UserAdapter {
  ToEntity(userPo: UserPo) {
    const user = new User();
    user.id = userPo.id;
    user.name = userPo.name;
    user.phone = userPo.phone;
    user.openId = userPo.openId;
    user.points = userPo.points;
    user.birthday = NewDate(userPo.birthday);
    user.gender = userPo.gender;
    user.cityCode = userPo.cityCode;
    return user;
  }

  ToEntityList(userPoList: UserPo[]) {
    return userPoList.map((userPo) => this.ToEntity(userPo));
  }

  ToPo(user: User) {
    const userPo = new UserPo();
    userPo.id = user.id;
    userPo.name = user.name;
    userPo.phone = user.phone;
    userPo.openId = user.openId;
    userPo.points = user.points;
    userPo.birthday = user.birthday;
    userPo.gender = user.gender;
    userPo.cityCode = user.cityCode;
    return userPo;
  }
}
