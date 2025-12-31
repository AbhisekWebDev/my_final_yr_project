import mongoose from "mongoose";

const medicineLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: { type: String, required: true }, // e.g., "Pan D"
  aiResponse: { type: String, required: true }, // Full Markdown report
  prescriptionStatus: { type: String }, // "OTC" or "Rx"
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("MedicineLog", medicineLogSchema);