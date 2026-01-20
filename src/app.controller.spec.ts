import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getIsAlive', () => {
    it('should return "Is alive!"', () => {
      const appController = app.get(AppController);
      expect(appController.getIsAlive()).toBe('Is alive!');
    });
  });
});
