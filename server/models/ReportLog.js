import mongoose from "mongoose";

const reportLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ocrText: { type: String, required: true }, // The raw text scanned from image
  analysis: { type: String, required: true }, // The AI's explanation
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ReportLog", reportLogSchema);