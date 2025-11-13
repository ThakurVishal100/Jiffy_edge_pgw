import express from 'express';
import sequelize from './config/database.js'; 
import models from './models/relation.js'; 

const {
  PaymentPlan,
  ServiceInfo,
  ClientInfo,
  PricePoint,
  ChargingInterface,
  ChIntfApiInfo
} = models;


const app = express();
app.use(express.json()); 
const PORT = process.env.BACKEND_SERVER_PORT || 3000;


app.get('/', (req, res) => {
  res.send('Jiffy Edge PGW API is running!');
});

/**
 * TEST 1: Get a Payment Plan and INCLUDE all its related data.
 * This will show:
 * - The Service it belongs to
 * - The Client it belongs to
 * - All PricePoints it has
 */

app.get('/api/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await PaymentPlan.findByPk(id, {
      include: [
        { model: ServiceInfo }, 
        { model: ClientInfo },  
        { model: PricePoint }   
      ]
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payment plan' });
  }
});

/**
 * TEST 2: Get a Charging Interface and INCLUDE all its related data.
 * This will show:
 * - All APIs that belong to it
 * - All PricePoints that use it
 */

app.get('/api/interfaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const iface = await ChargingInterface.findByPk(id, {
      include: [
        { model: ChIntfApiInfo },
        { model: PricePoint }    
      ]
    });

    if (!iface) {
      return res.status(404).json({ error: 'Interface not found' });
    }

    res.json(iface);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch charging interface' });
  }
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    console.log(`Server listening on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

