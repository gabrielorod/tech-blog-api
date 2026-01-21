import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - Deve retornar token com credenciais válidas', () => {
    return request(app.getHttpServer() as App)
      .post('/auth/login')
      .send({
        email: 'fred.marques@email.com',
        password: 'mudar123',
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST) - Deve retornar 401 para senha incorreta', () => {
    return request(app.getHttpServer() as App)
      .post('/auth/login')
      .send({
        email: 'fred.marques@email.com',
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
