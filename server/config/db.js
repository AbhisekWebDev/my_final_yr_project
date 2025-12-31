import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } 
    catch (error) {
        // Logic: If connection fails (bad internet, wrong password), 
        // we log the error and stop the server so it doesn't crash randomly later.
        console.error(`Error: ${error.message}`);
        
        process.exit(1); 
    }
}

export default connectDB;
