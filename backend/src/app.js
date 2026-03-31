import express from 'express';
import authRouter from './routes/auth.routes.js';
import productsRouter from './routes/products.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config/config.js';

const allowedOrigins = config.ALLOWED_ORIGINS.split(',');

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/', productsRouter);

export default app;
