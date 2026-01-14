import SymptomLog from "../models/SymptomLog.js"
import MedicineLog from "../models/MedicineLog.js"
import DietLog from "../models/DietLog.js"
import WorkoutLog from "../models/WorkoutLog.js"

import ReportLog from "../models/ReportLog.js"

// @desc    Get User Medical History
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        // Fetch logs in parallel, sorted by newest first
        const [symptoms, medicines, diets, workouts, reports] = await Promise.all([
            SymptomLog.find({ user: req.user._id }).sort({ createdAt: -1 }),
            MedicineLog.find({ user: req.user._id }).sort({ createdAt: -1 }),
            DietLog.find({ user: req.user._id }).sort({ createdAt: -1 }),
            WorkoutLog.find({ user: req.user._id }).sort({ createdAt: -1 }),
            ReportLog.find({ user: req.user._id }).sort({ createdAt: -1 })
        ]);

        res.json({ symptoms, medicines, diets, workouts, reports })
    } catch (error) {
        console.error("History Fetch Error:", error)
        res.status(500).json({ message: "Server Error" })
    }
}

// @desc    Get Single History Item
// @route   GET /api/history/:type/:id
const getHistoryDetails = async (req, res) => {
    const { type, id } = req.params;

    try {
        let data;

        if (type === 'symptom') {
            data = await SymptomLog.findOne({ _id: id, user: req.user._id })
        } else if (type === 'medicine') {
            data = await MedicineLog.findOne({ _id: id, user: req.user._id })
        } else if (type === 'diet') {
            data = await DietLog.findOne({ _id: id, user: req.user._id })
        } else if (type === 'workout') {
            data = await WorkoutLog.findOne({ _id: id, user: req.user._id })
        } else if (type === 'report') { // <--- Handle Report Details
            data = await ReportLog.findOne({ _id: id, user: req.user._id })
        }

        if (!data) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.json(data);
    } catch (error) {
        console.error("Detail Fetch Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

const clearHistory = async (req, res) => {
    try {
        await SymptomLog.deleteMany({ user: req.user._id });
        await MedicineLog.deleteMany({ user: req.user._id });
        await DietLog.deleteMany({ user: req.user._id }); // Clear Diets too
        res.json({ message: "History Cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing history" });
    }
};

export { getHistory, getHistoryDetails, clearHistory }