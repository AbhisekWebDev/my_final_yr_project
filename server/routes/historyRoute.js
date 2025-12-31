import express from 'express'
import { getHistory, getHistoryDetails } from '../controllers/historyController.js'
import { protect } from '../middleware/authmiddleware.js'

const router = express.Router()

router.get('/', protect, getHistory)

router.get('/:type/:id', protect, getHistoryDetails)

export default router