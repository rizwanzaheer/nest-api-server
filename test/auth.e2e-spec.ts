import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('it handle signup request', () => {
    const email = 'user@example.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'passworddf' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged user request', async () => {
    const email = 'user@example.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'passworddf' })
      .expect(201);
    // .then((res) => {
    //   const { id, email } = res.body;
    //   expect(id).toBeDefined();
    //   expect(email).toEqual(email);
    // });

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
