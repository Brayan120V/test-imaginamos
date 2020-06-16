import * as web from 'express-decorators';
import moment from 'moment';
import Service from '../models/service';
import verifyRole from '../policy/verifyRole';
import verifyToken from '../policy/verifyToken';

@web.basePath('/service')
class ServiceController {
  constructor() {
  }

  @web.put('/status/:id', [verifyToken, verifyRole('Technical')])
  async updateStatus(req, res) {
    const response = await Service.update('UPDATE service SET status = $1 WHERE idservice = $2 AND technical_person_id = $3 RETURNING status', [req.body.status, req.params.id, req.user.id]);
    res.status(response.status).send(response.data);
  }

  @web.put('/rate/:id', [verifyToken, verifyRole('Client')])
  async updateRate(req, res) {
    const response = await Service.update('UPDATE service SET rate = $1 WHERE idservice = $2 AND client_person_id = $3 RETURNING rate', [req.body.rate, req.params.id, req.user.id]);
    res.status(response.status).send(response.data);
  }

  @web.get('/', [verifyToken, verifyRole('Technical')])
  async list(req, res) {
    const date = moment(Date.now()).format('YYYY-MM-DD');
    const response = await Service.findAll(`SELECT * FROM service WHERE technical_person_id = ${req.user.id} AND requestat = $1`, [date.toString()]);
    res.status(response.status).send(response.data);
  }

  @web.get('/:id', [verifyToken])
  async id(req, res) {
    let response;
    (req.user.role === 'Client')
      ? response = await Service.findById(`SELECT * FROM service WHERE idservice = ${req.params.id} and client_person_id = ${req.user.id}`)
      : response = await Service.findById(`SELECT * FROM service WHERE idservice = ${req.params.id} and technical_person_id = ${req.user.id}`);
    res.status(response.status).send(response.data);
  }
}

module.exports = ServiceController;
