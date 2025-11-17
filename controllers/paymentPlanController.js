import { PaymentPlanService } from '../services/paymentPlanService.js';

const getPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await PaymentPlanService.getPlanById(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.json(plan);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to fetch payment plan' });
  }
};

export const PaymentPlanController = {
  getPlan,
};