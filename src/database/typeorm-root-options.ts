import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { typeOrmEntities } from './entities';

/**
 * Builds NestJS TypeORM options from ConfigService (runtime app bootstrap).
 * @param { ConfigService } configService - Nest config.
 * @returns { TypeOrmModuleOptions }
 */
export function buildTypeOrmRootOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const portRaw = configService.get<string>('DB_PORT', '5432');

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseInt(portRaw, 10),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'auction_house'),
    entities: typeOrmEntities,
    synchronize: false,
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsRun: configService.get<string>('DB_MIGRATIONS_RUN') === 'true',
    logging: configService.get<string>('DB_LOGGING') === 'true',
  };
}
