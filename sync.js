import sequelize from './config/database.js';
import './models/relation.js';

async function createTables() {
  try {
    
    await sequelize.sync({ force: false });
    console.log('All tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await sequelize.close();
  }
}

createTables();