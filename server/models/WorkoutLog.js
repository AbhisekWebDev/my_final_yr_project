import mongoose from "mongoose";

const workoutLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  frequency: { type: String, required: true }, // e.g., "1-2 days/week"
  goal: { type: String, required: true }, // e.g., "Weight Loss"
  aiPlan: { type: String, required: true }, // The Markdown Plan
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WorkoutLog", workoutLogSchema);