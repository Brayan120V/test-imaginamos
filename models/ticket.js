import pool from '../config/config';
import Service from './service';
import User from './user';

export default class Ticket {
  static async create(ticket, service) {
    const resTicket = await pool.query('INSERT INTO ticket(client_person_id, createdat) VALUES($1,$2) RETURNING idticket',
      [ticket.client_person_id, new Date(Date.now())]);

    const resTechnicals = (await User.findAll()).data.users;
    if (!resTechnicals) return { status: 400, data: { message: 'technicals not free' } };
    const resService = await Service.create({
      ticket_idticket: resTicket.rows[0].idticket,
      technical_person_id: resTechnicals[parseInt(Math.random() * (resTechnicals.length - 1))].id,
      client_person_id: ticket.client_person_id,
      ...service,
    });

    if (resService.status != 200) {
      await pool.query('DELETE FROM ticket WHERE idticket = $1', [resTicket.ticket]);
      return { status: 418, data: { message: 'ticket not created' } };
    }

    return { status: 200, data: { message: 'ticket created', service: resService.data.idservice } };
  }

  static async findAll(query) {
    const res = await pool.query(query);
    if (res.rows.length === 0) return ({ status: 404, data: { message: 'Not Found' } });
    return ({ status: 200, data: { tickets: res.rows } });
  }
}
