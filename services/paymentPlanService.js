
import models from '../models/relation.js';
const { PaymentPlan, ServiceInfo, ClientInfo, PricePoint } = models;


const getPlanById = async (id) => {
  try {
    const plan = await PaymentPlan.findByPk(id, {
      include: [
        { model: ServiceInfo },
        { model: ClientInfo },
        { model: PricePoint }
      ]
    });
    return plan;
  } catch (error) {
    throw new Error(`Error fetching plan: ${error.message}`);
  }
};

export const PaymentPlanService = {
  getPlanById,
};