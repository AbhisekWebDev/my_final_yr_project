import React, {useState} from 'react'

import { Link, useNavigate } from 'react-router-dom'

import axios from 'axios'

function UserLogin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // to navigate the user after successful login
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
             // A. Send the data to the backend
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios.post(
                'http://localhost:5000/api/users/login',
                { email, password },
                config
            )

            // Save user data so they stay logged in!
            // If don't do this, they will be "logged out" as soon as they refresh.
            localStorage.setItem('userInfo', JSON.stringify(data))

            // B. If successful, log it and move to medi page
            console.log('Login Successful:', data)
            alert('Login Successful!')

            // Navigate to your main app page
            navigate('/medi')
        } catch (error) {
            // C. If it fails 
            console.error('Lofin failed:', error.response.data.message)
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            
            {/* 3. Header */}
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
                AIM User Login
            </h2>

            <div className="space-y-6">
                
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                onClick={handleLogin}
                >
                    Login
                </button>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                    New to AIMed?{' '}
                    <Link 
                        to="/" 
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                        Register here
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserLogin