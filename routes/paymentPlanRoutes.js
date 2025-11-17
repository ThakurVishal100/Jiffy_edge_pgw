import { Router } from 'express';
import { PaymentPlanController } from '../controllers/paymentPlanController.js';

const router = Router();

router.get('/:id', PaymentPlanController.getPlan);


export default router;