import mongoose from "mongoose";

const symptomLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: { type: String, required: true }, // e.g., "Abdominal Pain"
  aiResponse: { type: String, required: true }, // The full Markdown response
  confidenceScore: { type: String }, // e.g., "80%"
  isSymptomQuery: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SymptomLog", symptomLogSchema);