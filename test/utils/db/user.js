import User from '../../../models/user';

class UserMock {
  static createAndLogin(data) {
    return UserMock.login(data);
  }

  static async login(data) {
    const user = data;
    await User.create(data);
    user.token = (await User.login(data)).data.token;
    return user;
  }

  static get model() {
    return User;
  }
}

module.exports = UserMock;
