import request from 'supertest';
import moment from 'moment';
import app from '../../../app';
import pool from '../../../config/config';
import User from '../../utils/db/user';

describe('Ticket', () => {
  let client;
  let technical1; let
    technical2;
  let server;
  const port = 8080;

  beforeAll(async (done) => {
    server = app.listen(process.env.PORT || port);

    client = await User.createAndLogin({
      id: 1056931500, name: 'Alejandro Cano', phone: 3124816400, role: 'Client', password: 'doscervezas',
    });

    technical1 = await User.createAndLogin({
      id: 1056931501, name: 'Alejandra Cano', phone: 3124816401, role: 'Technical', password: 'doscervezas',
    });

    technical2 = await User.createAndLogin({
      id: 1056931502, name: 'Alejandro Canoa', phone: 3124816403, role: 'Technical', password: 'doscervezas',
    });
    done();
  });

  afterAll(async (done) => {
    await pool.query('DELETE FROM service');
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM person');

    server.close();
    done();
  });

  it('should create a ticket and return message', async (done) => {
    const res = await request(server)
      .post('/api/v1/ticket/create')
      .send({ type: 'Maintenance', address: 'Cra 18 #12-19', requestat: moment(Date.now()).add(1, 'd').format('YYYY-MM-DD') })
      .set({ token: client.token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ message: 'ticket created', service: expect.any(Number) }));
    done();
  });

  it('should get all tickets', async (done) => {
    const res = await request(server)
      .get('/api/v1/ticket')
      .set({ token: client.token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ tickets: expect.any(Array) }));
    done();
  });
});
