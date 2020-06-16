import app from './app.js';

const port = 8080;

const server = app.listen(process.env.PORT || port);

module.exports = server;
