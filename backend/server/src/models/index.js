import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import ResourceModel from './resource.js';
import UserModel from './user.js';
import ProfileModel from './profile.js';
import PlotModel from './plot.js';
import ActivityModel from './activity.js';
import WorkerModel from './worker.js';
import ActivityAssignmentModel from './activityAssignment.js';
import PasswordResetModel from './passwordReset.js';

dotenv.config();

// Choose SQLite for development, MySQL for production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
dotenv.config({ path: path.resolve(projectRoot, '.env') });

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
let sequelize;

if (isDev) {
  console.log('🔧 Using SQLite database (development mode)');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(projectRoot, 'dev.sqlite'),
    logging: false,
  });
} else {
  console.log('🚀 Using MySQL database (production mode)');
  console.log('📊 MySQL Configuration:');
  console.log(`   - Host: ${process.env.MYSQL_HOST || 'NOT SET'}`);
  console.log(`   - Port: ${process.env.MYSQL_PORT || 'NOT SET (default: 3306)'}`);
  console.log(`   - Database: ${process.env.MYSQL_DATABASE || 'NOT SET'}`);
  console.log(`   - User: ${process.env.MYSQL_USER || 'NOT SET'}`);
  console.log(`   - Password: ${process.env.MYSQL_PASSWORD ? '***SET***' : 'NOT SET'}`);

  // Validate required environment variables
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_DATABASE) {
    console.error('❌ ERROR: Missing required MySQL environment variables!');
    console.error('   Required: MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE, MYSQL_PASSWORD');
    throw new Error('Missing required MySQL configuration');
  }

  sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
  });
}

const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Resource = ResourceModel(sequelize);
const Plot = PlotModel ? PlotModel(sequelize) : null;
const Activity = ActivityModel ? ActivityModel(sequelize) : null;
const Worker = WorkerModel ? WorkerModel(sequelize) : null;
const ActivityAssignment = ActivityAssignmentModel ? ActivityAssignmentModel(sequelize) : null;
const PasswordReset = PasswordResetModel ? PasswordResetModel(sequelize) : null;

// Associations (approximate mappings from the original SQL)
if (Profile && User) {
  // profile.id references auth.users(id) originally; here we keep profile.id = user.id
  Profile.belongsTo(User, { foreignKey: 'id', targetKey: 'id' });
}

if (Plot && Activity) {
  Plot.hasMany(Activity, { foreignKey: 'id_parcela', onDelete: 'CASCADE' });
  Activity.belongsTo(Plot, { foreignKey: 'id_parcela', as: 'plots' });
}

if (Plot && Resource) {
  Plot.hasMany(Resource, { foreignKey: 'id_parcela', onDelete: 'CASCADE', as: 'resources' });
  Resource.belongsTo(Plot, { foreignKey: 'id_parcela', as: 'plots' });
}

if (Worker && Profile) {
  Worker.belongsTo(Profile, { foreignKey: 'id_usuario', as: 'profiles' });
  Profile.hasOne(Worker, { foreignKey: 'id_usuario' });
}

if (Activity && ActivityAssignment && Worker) {
  Activity.hasMany(ActivityAssignment, { foreignKey: 'id_actividad', as: 'assignments' });
  ActivityAssignment.belongsTo(Activity, { foreignKey: 'id_actividad', as: 'activity' });
  Worker.hasMany(ActivityAssignment, { foreignKey: 'id_trabajador', as: 'assignments' });
  ActivityAssignment.belongsTo(Worker, { foreignKey: 'id_trabajador', as: 'worker' });
}

export { sequelize, User, Profile, Resource, Plot, Activity, Worker, ActivityAssignment };
export { PasswordReset };
