import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    logging: false,
    pool: {
      max: 10,        // max number of connections
      min: 0,
      acquire: 30000, // max time (ms) to get connection
      idle: 10000,    // max time (ms) connection can be idle
    },
  }
);

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// testConnection();

export default sequelize;
