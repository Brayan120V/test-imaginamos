import request from 'supertest';
import app from '../../../app';
import pool from '../../../config/config';

describe('User', () => {
  let server;
  const port = 8080;

  const user = {
    id: 1056931400, name: 'Daniel Quijano', phone: 3124816461, role: 'Technical', password: 'unacerveza',
  };

  beforeAll((done) => {
    server = app.listen(process.env.PORT || port);
    done();
  });

  afterAll(async (done) => {
    await pool.query('DELETE FROM service');
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM person');

    server.close();
    done();
  });

  it('should create a user and return message', async (done) => {
    const res = await request(server)
      .post('/api/v1/user/create')
      .send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'user created' });
    done();
  });

  it('should login a user and return message and token', async (done) => {
    const res = await request(server)
      .post('/api/v1/user/login')
      .send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ message: 'user logged', token: expect.any(String) }));
    done();
  });
});
