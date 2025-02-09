import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '124.221.112.227',
  port:  3306,
  username: 'task',
  password: 'XnbhmjyCpxasnafR',
  database: 'task',
  autoLoadEntities: true,
  synchronize: true,
};
export default config;
