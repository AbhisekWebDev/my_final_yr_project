import React, {useState} from 'react'

import { Link, useNavigate } from 'react-router-dom'

import axios from 'axios'

function UserRegistration() {

    // variables to hold the user input
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // to navigate the user after succesful registration
    const navigate = useNavigate()

    // function to handle the form submission
    const handleRegister = async () => {
        try {
            // A. Send the data to the backend
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios.post(
                'http://localhost:5000/api/users',
                { name, email, password },
                config
            )

            // B. If successful, log it and move to login page
            console.log('Registration Successful:', data)
            alert('Registration Successful! Please Login.')
            navigate('/login')
        } catch (error) {
            // C. If it fails (e.g., email already exists)
            console.error('Registration failed:', error.response.data.message)
        }
    }

  return (
    // 1. Main Container: Centers everything, light gray background
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      {/* 2. The Card: White background, shadow, rounded corners */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        
        {/* 3. Header */}
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
          AIM Registration
        </h2>

        <div className="space-y-6">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Abhisek Kumar"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Button: Medical Blue with hover effect */}
          <button 
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
        >
            Register
          </button>

          {/* THE STYLED LINK */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already a user?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all"
              >
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserRegistration