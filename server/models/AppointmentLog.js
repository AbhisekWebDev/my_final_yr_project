import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: { type: String, required: true },
  specialty: { type: String, required: true }, // e.g., Cardiologist
  date: { type: Date, required: true },        // Stores both date and time
  location: { type: String },                  // e.g., Apollo Hospital
  status: { type: String, default: "Upcoming" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);