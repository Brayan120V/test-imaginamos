import request from 'supertest';
import moment from 'moment';
import app from '../../../app';
import pool from '../../../config/config';
import User from '../../utils/db/user';
import Ticket from '../../utils/db/ticket';

describe('Get services', () => {
  let client;
  let technical1; let
    technical2;
  let service1; let service2; let service3; let service4; let service5; let
    service6;
  let server;
  const port = 8080;

  beforeAll(async (done) => {
    server = app.listen(process.env.PORT || port);

    client = await User.createAndLogin({
      id: 1055931500, name: 'Esteban Leal', phone: 3114816400, role: 'Client', password: 'doscervezas',
    });

    technical1 = await User.createAndLogin({
      id: 1055931501, name: 'Oscar Barril', phone: 3114816401, role: 'Technical', password: 'doscervezas',
    });

    service1 = await Ticket.create(client, { type: 'Maintenance', address: 'Cra 18 #12-19', requestat: moment(Date.now()).format('YYYY-MM-DD') });
    service2 = await Ticket.create(client, { type: 'Maintenance', address: 'Cra 19 #12-19', requestat: moment(Date.now()).format('YYYY-MM-DD') });
    service3 = await Ticket.create(client, { type: 'Maintenance', address: 'Cra 20 #12-19', requestat: moment(Date.now()).format('YYYY-MM-DD') });
    service4 = await Ticket.create(client, { type: 'Maintenance', address: 'Cra 21 #12-19', requestat: moment(Date.now()).add(1, 'd').format('YYYY-MM-DD') });
    service5 = await Ticket.create(client, { type: 'Maintenance', address: 'Cra 22 #12-19', requestat: moment(Date.now()).add(1, 'd').format('YYYY-MM-DD') });
    service6 = await Ticket.create(client, { type: 'Maintenance', address: 'Cra 23 #12-19', requestat: moment(Date.now()).add(1, 'd').format('YYYY-MM-DD') });

    done();
  });

  afterAll(async (done) => {
    await pool.query('DELETE FROM service');
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM person');

    server.close();
    done();
  });

  it('should get all services', async (done) => {
    const res = await request(server)
      .get('/api/v1/service')
      .set({ token: technical1.token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ tickets: expect.any(Array) }));
    done();
  });

  it('should get a specific service', async (done) => {
    const res = await request(server)
      .get(`/api/v1/service/${service1.data.service}`)
      .set({ token: technical1.token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ tickets: expect.any(Array) }));
    done();
  });

  it('should update status service and return message with status', async (done) => {
    const res = await request(server)
      .put(`/api/v1/service/status/${service1.data.service}`)
      .send({ status: 'Working' })
      .set({ token: technical1.token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ message: 'service updated', status: 'Working' }));
    done();
  });

  it('should update rate service and return message with rate', async (done) => {
    const res = await request(server)
      .put(`/api/v1/service/rate/${service1.data.service}`)
      .send({ rate: 4.5 })
      .set({ token: client.token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({ message: 'service updated', rate: 4.5 }));
    done();
  });
});
