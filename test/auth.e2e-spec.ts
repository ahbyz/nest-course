import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const testEmail = 'e2euser@email.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: 'e2e_password' })
      .expect(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);
  });

  it('signup and return new user', async () => {
    const testEmail = 'testUser@email.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: 'e2epassword' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(testEmail);
  });
});
