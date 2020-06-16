import * as web from 'express-decorators';
import User from '../models/user';

@web.basePath('/user')
class UserController {
  constructor() {
  }

  @web.post('/create')
  async create(req, res) {
    const response = await User.create(req.body);
    res.status(response.status).send(response.data);
  }

  @web.post('/login')
  async login(req, res) {
    const response = await User.login(req.body);
    res.status(response.status).send(response.data);
  }
}

module.exports = UserController;
