import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

interface RequestWithUser {
  user: { id: number; email: string };
}

describe('CommentsController', () => {
  let controller: CommentsController;

  const mockCommentsService = {
    create: jest.fn(),
    findAllByArticle: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  describe('create', () => {
    it('deve chamar o service.create com os dados corretos', async () => {
      const dto: CreateCommentDto = { content: 'Teste', articleId: 1 };

      const req = {
        user: { id: 1, email: 'gabriel@test.com' },
      } as unknown as RequestWithUser;

      mockCommentsService.create.mockResolvedValue({ id: 1, ...dto });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      const result = await controller.create(dto, req as any);

      expect(mockCommentsService.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toHaveProperty('id');
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de comentários do service', async () => {
      const resultMock = [{ id: 1, content: 'Comentário 1' }];
      mockCommentsService.findAllByArticle.mockResolvedValue(resultMock);

      const result = await controller.findAll(1);

      expect(mockCommentsService.findAllByArticle).toHaveBeenCalledWith(1);
      expect(result).toEqual(resultMock);
    });
  });
});
