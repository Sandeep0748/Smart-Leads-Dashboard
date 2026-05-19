import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Leads Dashboard API' });
});

app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/leads', leadRoutes);
app.use('/api/leads', leadRoutes);

app.use(errorHandler);

export default app;
