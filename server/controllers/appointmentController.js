import AppointmentLog from "../models/AppointmentLog.js";

// @desc    Add a new appointment
// @route   POST /api/appointments
const addAppointment = async (req, res) => {
    const { doctorName, specialty, date, location } = req.body;

    if (!req.user) {
            console.error("❌ Error: User not found in request. Is 'protect' middleware used?");
            return res.status(401).json({ message: "User not authorized" });
        }

    try {
        const appointment = await AppointmentLog.create({
            user: req.user._id,
            doctorName,
            specialty,
            date,
            location
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Failed to add appointment" });
    }
};

// @desc    Get all appointments for user
// @route   GET /api/appointments
const getAppointments = async (req, res) => {
    try {

        if (!req.user) {
            console.error("❌ Error: User not found in request. Is 'protect' middleware used?");
            return res.status(401).json({ message: "User not authorized" });
        }

        // Get upcoming appointments only, sorted by nearest date
        const appointments = await AppointmentLog.find({ 
            user: req.user._id,
            date: { $gte: new Date() } // Only future dates
        }).sort({ date: 1 });
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
};

export { addAppointment, getAppointments };