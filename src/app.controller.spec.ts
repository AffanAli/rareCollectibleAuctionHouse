import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API health string from the health endpoint handler', () => {
      expect(appController.getHealth()).toBe(
        'Rare Collectible Auction House API',
      );
    });

    it('should render the public landing page', () => {
      expect(appController.getLandingPage()).toContain(
        'Rare Collectible Auction House',
      );
      expect(appController.getLandingPage()).toContain(
        "The collector's marketplace",
      );
    });
  });
});
