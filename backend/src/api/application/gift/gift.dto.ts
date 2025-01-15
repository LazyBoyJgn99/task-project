import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserVo } from '../user/user.dto';

export class GiftUseDto {
  @ApiProperty({
    description: '卡劵Id',
  })
  @IsString()
  id: string;
}

export class GiftQueryDto {
  @ApiProperty({
    description: '用户Id',
  })
  @IsString()
  userId: string;
}

export class GiftQueryDetailDto {
  @ApiProperty({
    description: '礼品id',
  })
  @IsString()
  id: string;
}

export class GiftVo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  user: UserVo;

  @ApiProperty()
  name: string;

  @ApiProperty({
    example: '2024-09-05 to 2024-10-05',
  })
  canUseTime: string;
}
