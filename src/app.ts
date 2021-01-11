/**
 * App Definition
 */

/**
* Module dependencies.
*/
import express from 'express';
import morgan from 'morgan';
import router from './router';
import path from 'path';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './api/swagger.json';
import cors from 'cors';

const app = express();

/* View engine setup */
app.set('views', path.join(process.cwd(), 'src/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* Middleware setups */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'src/views')));
app.use(cors());

/* Swagger API route */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/* API router setup */
app.use(router);

export default app;