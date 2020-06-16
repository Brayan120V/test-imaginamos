import * as web from 'express-decorators';
import Ticket from '../models/ticket';
import verifyRole from '../policy/verifyRole';
import verifyToken from '../policy/verifyToken';

@web.basePath('/ticket')
class TicketController {
  constructor() {
  }

  @web.post('/create', [verifyToken, verifyRole('Client')])
  async create(req, res) {
    const response = await Ticket.create(
      { client_person_id: req.user.id },
      req.body,
    );
    res.status(response.status).send(response.data);
  }

  @web.get('/', [verifyToken, verifyRole('Client')])
  async list(req, res) {
    const response = await Ticket.findAll(`SELECT * FROM ticket WHERE client_person_id = ${req.user.id}`);
    res.status(response.status).send(response.data);
  }
}

module.exports = TicketController;
