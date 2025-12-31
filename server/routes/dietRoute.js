import express from 'express';
import { generateDietPlan } from '../controllers/dietController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, generateDietPlan);

export default router;