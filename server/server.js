import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

// Importing the database connection function
import connectDB from './config/db.js'

// Importing Route from route files
import userRoute from './routes/userRoute.js'

// Importing Chat Route for AI interactions
import chatRoute from './routes/chatRoute.js'

// importing history route for to show the search history
import historyRoute from './routes/historyRoute.js'

// importing diet route for to show the diet plans
import dietRoute from './routes/dietRoute.js'

dotenv.config()

// 2. Connect to Database
connectDB()

const PORT = process.env.PORT || 5000;

// Middleware
// Logic: CORS allows your React app (running on a different port) to talk to this API.
const app = express()

app.use(cors(
    {
        origin: 'http://localhost:5173', // Your React URL
        credentials: true
    }
))

// Logic: This allows your server to understand JSON data sent in the body of a request.
// Without this, req.body will be undefined!
app.use(express.json())

// Routes Middleware
// Logic: When the server gets a request to /api/users, 
// it will forward it to the userRoutes we defined in userRoute.js
app.use('/api/users', userRoute)

// Chat Routes Middleware
// Logic: Handles all AI chat related requests at /api/chat
// Forwards to chatRoutes defined in chatRoute.js
app.use('/api/chat', chatRoute)

// history route middileware
// logic: handles user history
// will show in {history page}
app.use('/api/history', historyRoute)

app.use('/api/diet', dietRoute)

// Basic Test Route
// Logic: A simple check to ensure the server is alive before we add complex AI logic.
app.get('/', (req, res) => 
    {
    res.send('AIMed server is running at port ' + PORT)
    }
)

// Start the Server
app.listen(PORT, () => 
    {
    console.log(`Server running on port ${PORT}`);
    }
)