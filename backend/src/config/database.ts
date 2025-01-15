import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '101.43.99.171',
  port: 3306,
  username: 'farm_pos',
  password: 'yf7AR5i4TKRpSrjX',
  database: 'farm_pos',
  synchronize: true,
  autoLoadEntities: true,
};
export default config;
