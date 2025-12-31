// The Controller is just a function sitting there. 
// We need to create a Route (a URL path) so the outside world can trigger it

import express from 'express'

import { registerUser, authUser } from '../controllers/userController.js'

const router = express.Router()

// Logic: When someone sends a POST request to this path, run the 'registerUser' function
router.post('/register', registerUser)

// Logic: When someone sends a POST request to this path, run the 'authUser' function
router.post('/login', authUser)

export default router