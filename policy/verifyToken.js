import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.get('token');
  if (!token) return res.status(403).send({ message: 'Forbbiden' });

  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) return res.status(403).send({ message: 'Forbbiden' });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
