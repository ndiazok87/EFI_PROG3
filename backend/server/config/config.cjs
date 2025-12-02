const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const sqliteStorage = path.resolve(__dirname, '..', '..', 'dev.sqlite');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || null,
    database: process.env.MYSQL_DATABASE || 'cultivador',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
  },
};
