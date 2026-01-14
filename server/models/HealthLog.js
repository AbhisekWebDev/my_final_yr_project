import mongoose from "mongoose";

const HealthLogSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // The day of the record
  steps: { type: Number, required: true },
  calories: { type: Number, required: true }, // kcal
  distance: { type: Number, required: true }, // in km
  heartRate: { type: Number, required: true }, // avg bpm
  sleep: { type: Number, required: true } // in hours
});

// Compound index to ensure one log per user per day
HealthLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('HealthLog', HealthLogSchema);