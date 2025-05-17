import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import companyRoutes from './routes/companies';
import { authMiddleware } from './middleware/auth';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  // Placeholder login logic
  const { email } = req.body;
  const token = 'signed-jwt-token';
  res.json({ id: 1, email, token });
});

app.use('/companies', authMiddleware, companyRoutes);

export default app;
