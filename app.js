import * as web from 'express-decorators';
import express from 'express';
import bodyParser from 'body-parser';
import requireAll from 'require-all';
import path from 'path';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import Router from 'express';
import cors from 'cors';

const swaggerDocument = require('./swagger.json');

const app = express();
const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV === 'development') app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000,
}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', router);

const modules = requireAll(`${__dirname}/controllers`);
Object.keys(modules)
  .map((k) => modules[k])
  .map((_val) => {
    const n = new _val();
    if (n.custom) {
      return app.use(n.router);
    }
    return web.register(router, n);
  });

module.exports = app;
