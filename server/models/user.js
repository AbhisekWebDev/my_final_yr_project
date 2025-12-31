import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true // No two users can have the same email
        },
        password: {
            type: String,
            required: true
        }
    }
    , {
        timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
    }
)

// 2. The "Pre-Save" Hook (Automatic Encryption)
// Logic: Before saving a user to the DB, check if the password changed.
// If yes, hash it using bcrypt.
// This is the magic. You never have to manually hash passwords in your controller. You just save the user, and this runs automatically.
userSchema.pre('save', async function (next) {
    
    if (!this.isModified('password')) {
        next()
    }
    
    // Generate a "salt" (random data) and hash the password with it
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// 3. The Password Matcher (For Login later)
// Logic: This creates a custom function we can call later to check 
// if the password user typed matches the encrypted one in DB.
// When we build the Login route next, we can simply call user.matchPassword(password) to verify them.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User