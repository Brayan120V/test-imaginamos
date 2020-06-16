const verifyRole = (role) => async (req, res, next) => {
  if (req.user.role === role) { return next(); }
  return res.status(403).send({ message: 'Forbbiden' });
};

module.exports = verifyRole;
