import express, { Application } from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';

import userRoutes from './routes/userRoutes';

const app: Application = express();
const swaggerConfig = yaml.load('./swagger.yaml');

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
app.use('/storage', express.static(`${__dirname}/public`));

app.use('/api', userRoutes);

export default app;