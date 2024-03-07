import express, { Application } from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app: Application = express();
const swaggerConfig = yaml.load('./swagger.yaml');

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
app.use('/storage', express.static(`${__dirname}/public`));

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

export default app;