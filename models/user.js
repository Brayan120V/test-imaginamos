import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/config';

export default class User {
  static generateToken(user) {
    delete user.password;
    return jwt.sign(
      user, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRE },
    );
  }

  static async create(user) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    await pool.query('INSERT INTO person VALUES($1,$2,$3,$4,$5)', [user.id, user.name, user.phone, user.role, hash]);
    return { status: 200, data: { message: 'user created' } };
  }

  static async login(user) {
    const res = await pool.query('SELECT * FROM person WHERE id = $1', [user.id]);
    if (res.rows.length === 0 || !bcrypt.compareSync(user.password, res.rows[0].password)) return { status: 404, data: { message: 'user or password not exists' } };
    return { status: 200, data: { message: 'user logged', token: this.generateToken(res.rows[0]) } };
  }

  static async findAll() {
    const res = await pool.query('SELECT id FROM person WHERE role = $1', ['Technical']);
    if (res.rows.length === 0) return { status: 404, data: { message: 'Not Found' } };
    return { status: 200, data: { users: res.rows } };
  }
}
