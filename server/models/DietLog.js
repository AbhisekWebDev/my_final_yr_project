import mongoose from "mongoose";

const dietLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: { type: String, required: true }, // e.g., "Weight Loss"
  allergies: { type: String }, // e.g., "Peanuts, Dairy"
  medicalConditions: { type: String }, // e.g., "Diabetes, Hypertension"
  aiPlan: { type: String, required: true }, // The full Markdown plan
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DietLog", dietLogSchema);