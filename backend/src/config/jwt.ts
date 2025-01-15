import { JwtModuleOptions } from '@nestjs/jwt';
import configuration from 'config/configuration';

const config: JwtModuleOptions = {
  global: true,
  secret: configuration.jwt.secret,
  signOptions: { expiresIn: configuration.jwt.expiresIn },
};

export default config;
