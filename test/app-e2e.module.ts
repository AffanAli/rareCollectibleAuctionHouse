import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

/**
 * Minimal app shell for e2e smoke tests without a live PostgreSQL instance.
 * Full-stack tests can target {@link AppModule} when the database is available.
 */
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppE2eModule {}
