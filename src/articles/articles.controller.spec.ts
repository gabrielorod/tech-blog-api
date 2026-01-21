import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const mockArticlesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('deve retornar lista de artigos', async () => {
    const result = [{ id: 1, title: 'NestJS' }];
    mockArticlesService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(mockArticlesService.findAll).toHaveBeenCalled();
  });
});
