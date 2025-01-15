import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

/**
 * 生成基于时间戳和随机数的唯一 ID
 * @returns id
 */
function generateTimestampId() {
  // 使用 36 进制缩短时间戳长度，确保时间戳部分占用 10 位
  const timestamp = Date.now().toString(36).padStart(10, '0');

  // 生成 22 位的随机字符串，确保总长度为 32 位
  const randomPart = Array(22)
    .fill(0)
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join('');

  // 拼接后返回 32 位字符串
  return (timestamp + randomPart).substring(0, 32);
}
export abstract class BasePo extends TypeOrmBaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createTime: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updateTime: Date;

  @BeforeInsert()
  generateId() {
    this.id = generateTimestampId();
  }
}
