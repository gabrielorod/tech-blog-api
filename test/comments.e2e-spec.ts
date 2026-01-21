import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { PrismaService } from 'src/database/prisma.service';
import { App } from 'supertest/types';

interface LoginResponse {
  access_token: string;
}

describe('Comments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    const loginResponse = await request(app.getHttpServer() as App)
      .post('/auth/login')
      .send({ email: 'fred.marques@email.com', password: 'mudar123' });

    const body = loginResponse.body as LoginResponse;
    accessToken = body.access_token;
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "Comment" RESTART IDENTITY CASCADE',
    );
    await prisma.$disconnect();
    await app.close();
  });

  describe('/comments (POST)', () => {
    it('deve criar um comentário raiz com sucesso', () => {
      return request(app.getHttpServer() as App)
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Comentário de teste E2E',
          articleId: 1,
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
  });

  describe('/comments/article/:id (GET)', () => {
    it('deve retornar a lista de comentários com replies', async () => {
      const response = await request(app.getHttpServer() as App)
        .get('/comments/article/1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
