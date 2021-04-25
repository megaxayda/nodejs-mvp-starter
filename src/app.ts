import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import kill from 'kill-port';
import mongoose from 'mongoose';
import addAdminRoute from './route/admin';
import configPassport from './configPassport';

export async function app() {
  // Get env
  dotenv.config();
  const NODE_ENV = process.env.NODE_ENV;
  const PORT = process.env.PORT;
  let MONGO_URI = process.env.MONGO_URI;

  if (process.env.NODE_ENV === 'test') {
    MONGO_URI = process.env.MONGO_URI_TEST;
  }

  await mongoose.connect(MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  // we're connected!
  const app = express();
  app.use(helmet());
  app.use(express.json());

  if (process.env.NODE_ENV === 'dev') {
    console.log(chalk.blue('NODE_ENV:', process.env.NODE_ENV));
    console.log(chalk.blue('MONGO_URI:', process.env.MONGO_URI));
    console.log(chalk.blue('SECRET:', process.env.SECRET));
  } else {
    app.use(
      cors({
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200,
      })
    );
  }
  if (NODE_ENV !== 'test') {
    app.use(morgan(NODE_ENV === 'dev' ? 'dev' : 'combined'));
  }

  configPassport(app);

  const mainRouter = express.Router();
  app.use('/api', mainRouter);

  await addAdminRoute(mainRouter);

  await kill(PORT, 'tcp');

  const server = app.listen(PORT, () => {
    console.log(chalk.green(`Listening at http://localhost:${PORT}`));
  });

  return server;
}

export default app;
