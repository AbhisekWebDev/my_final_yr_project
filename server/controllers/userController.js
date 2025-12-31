// What this code does:
// Checks if the user already exists (we don't want duplicate emails).
// Creates the new user in the database.
// Responds with the user's data (excluding the password) if successful.

import asyncHandler from 'express-async-handler'

import generateToken from '../utils/generateToken.js'

import User from '../models/user.js'

// @desc    Register a new user
// @route   POST /api/users
// @access  Public

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validation: Did they send all the data?
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        // Check if user already exists
        const userExists = await User.findOne({ email })
        
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create the user
        // (The .pre('save') middleware in User.js will automatically hash the password here)
        const user = await User.create({
            name,
            email,
            password
        })

        if (user) {
            // Send back the success response
            res.status(201).json(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    // We will add the "Token" here in the next phase
                    token: generateToken(user._id)
                }
            )
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        // Simple error handling for now
        res.status(400).json({ message: error.message });
    }
}

// authUser
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const {email, password} = req.body

        // find the user by email
        const user = await User.findOne({email})

        // check if user exists and password matches
        // we defined matchPassword in userModel.js
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                // We will add the "Token" here in the next phase
                token: generateToken(user._id)
            })
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export { registerUser, authUser }