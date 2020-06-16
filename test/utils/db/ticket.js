import Ticket from '../../../models/ticket';

class TicketMock {
  static create(client, data) {
    return Ticket.create({ client_person_id: client.id }, data);
  }

  static get model() {
    return Ticket;
  }
}

module.exports = TicketMock;
