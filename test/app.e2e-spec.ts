import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppE2eModule } from './app-e2e.module';

describe('AppController (e2e)', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppE2eModule],
    }).compile();

    appController = moduleFixture.get<AppController>(AppController);
  });

  it('/ (GET)', () => {
    const html = appController.getLandingPage();
    expect(html).toContain('Rare Collectible Auction House');
    expect(html).toContain('Create your account');
  });

  it('/health (GET)', () => {
    expect(appController.getHealth()).toBe(
      'Rare Collectible Auction House API',
    );
  });
});
