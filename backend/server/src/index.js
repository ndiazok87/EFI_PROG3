import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import resourcesRouter from './routes/resources.js';
import authRouter from './routes/auth.js';
import profilesRouter from './routes/profiles.js';
import plotsRouter from './routes/plots.js';
import activitiesRouter from './routes/activities.js';
import workersRouter from './routes/workers.js';
import assignmentsRouter from './routes/assignments.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// mount API routes
app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/users', usersRouter);
app.use('/api/plots', plotsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/workers', workersRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/resources', resourcesRouter);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // Sync DB: in development sync({ alter: true }) is convenient; in prod use migrations
    if (process.env.NODE_ENV === 'development') {
      try {
        // Try to apply schema changes in development. Some dialects (SQLite)
        // can fail when attempting to alter tables with existing FK constraints.
        await sequelize.sync({ alter: true });
        console.log('Database synced (development) using alter');
      } catch (err) {
        console.warn('sequelize.sync({ alter: true }) failed, falling back to sequelize.sync():', err.message || err);
        // Fallback: perform a safe sync that only creates missing tables/columns
        // without attempting destructive drops/changes that may violate FK constraints.
        await sequelize.sync();
        console.log('Database synced (development) using fallback sync');
      }
    } else {
      await sequelize.authenticate();
      console.log('Database connection authenticated');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
