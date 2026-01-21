import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app/app.module';

interface ArticleResponse {
  id: number;
  title: string;
  content: string;
}

describe('Articles (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/articles (GET)', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/articles')
      .expect(200);

    const articles = response.body as ArticleResponse[];

    expect(Array.isArray(articles)).toBe(true);

    if (articles.length > 0) {
      expect(articles[0]).toHaveProperty('title');
      expect(articles[0]).toHaveProperty('content');
    }
  });

  it('/articles/:id (GET)', async () => {
    const response = await request(app.getHttpServer() as App)
      .get('/articles/1')
      .expect(200);

    const article = response.body as ArticleResponse;
    expect(article).toHaveProperty('id', 1);
  });
});
