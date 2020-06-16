import pool from '../config/config';

export default class Service {
  static async create(service) {
    const res = await pool.query('INSERT INTO service(ticket_idticket,technical_person_id,client_person_id,type,address,requestat,rate) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING idservice',
      [service.ticket_idticket, service.technical_person_id, service.client_person_id, service.type, service.address, service.requestat, service.rate]);
    return { status: 200, data: { message: 'service created', ...res.rows[0] } };
  }

  static async findById(query) {
    const res = await pool.query(query);
    if (res.rows.length === 0) return ({ status: 404, data: { message: 'Not Found' } });
    return ({ status: 200, data: { tickets: res.rows } });
  }

  static async findAll(query, params) {
    const res = await pool.query(query, params);
    if (res.rows.length === 0) return ({ status: 404, data: { message: 'Not Found' } });
    return ({ status: 200, data: { tickets: res.rows } });
  }

  static async update(query, params) {
    const res = await pool.query(query, params);
    return ({ status: 200, data: { message: 'service updated', ...res.rows[0] } });
  }
}
