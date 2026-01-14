import express from 'express';
import HealthLog from '../models/HealthLog.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Helper to get random number
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// @route   POST /api/health/sync-mock
// @desc    Generate 7 days of realistic mock data
router.post('/sync-mock', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Clear existing data
    await HealthLog.deleteMany({ user: userId });

    const logs = [];
    
    // 2. Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i); 
      
      const steps = getRandom(3000, 12000); 
      const distance = parseFloat((steps * 0.0008).toFixed(2)); 
      const calories = Math.floor(steps * 0.04) + getRandom(1200, 1500); 
      const heartRate = getRandom(65, 95); 
      const sleep = parseFloat((getRandom(50, 90) / 10).toFixed(1)); 

      logs.push({
        user: userId,
        date: d,
        steps,
        distance,
        calories,
        heartRate,
        sleep
      });
    }

    // 3. Save to DB
    await HealthLog.insertMany(logs);

    res.json({ msg: "Health data synchronized successfully", data: logs });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/health/stats
// @desc    Get user's health logs
router.get('/stats', protect, async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// CRITICAL FIX: This allows "import healthRoute from ..." to work
export default router;