import express from 'express';
import { generateWorkoutPlan } from '../controllers/workoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, generateWorkoutPlan);

export default router;