import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { addAppointment, getAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.route('/').post(protect, addAppointment).get(protect, getAppointments);

export default router;