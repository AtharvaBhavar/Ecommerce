import { sequelize } from '../config/database.js';
import seedData from './seedData.js';

const runSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    console.log('Database synchronized.');
    
    await seedData();
    
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
};

runSeed();