import SymptomLog from "../models/SymptomLog.js";
import WorkoutLog from "../models/WorkoutLog.js";
import DietLog from "../models/DietLog.js";
import AppointmentLog from "../models/AppointmentLog.js";

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. CALCULATE PENDING REPORTS (Unread Logs)
        // Assuming you add 'isRead: false' to your schemas later. 
        // For now, we can count logs created in the last 24 hours as "New/Pending"
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const [recentSymptoms, recentDiets, recentWorkouts] = await Promise.all([
            SymptomLog.countDocuments({ user: userId, createdAt: { $gte: oneDayAgo } }),
            DietLog.countDocuments({ user: userId, createdAt: { $gte: oneDayAgo } }),
            WorkoutLog.countDocuments({ user: userId, createdAt: { $gte: oneDayAgo } })
        ]);

        const pendingReports = recentSymptoms + recentDiets + recentWorkouts;

        // 2. CALCULATE HEALTH SCORE (Based on BMI from Workout Log)
        let healthScore = 50; // Base score
        const latestWorkout = await WorkoutLog.findOne({ user: userId }).sort({ createdAt: -1 });

        if (latestWorkout) {
            const heightM = latestWorkout.height / 100; // cm to meters
            const bmi = latestWorkout.weight / (heightM * heightM);

            // BMI Logic
            if (bmi >= 18.5 && bmi <= 24.9) {
                healthScore += 40; // Healthy weight bonus
            } else if (bmi >= 25 && bmi <= 29.9) {
                healthScore += 20; // Overweight but okay
            } else {
                healthScore += 10; // Obese or Underweight
            }

            // Consistency Bonus (Has a plan)
            healthScore += 10; 
        } else {
            healthScore = "--"; // No data yet
        }

        // 3. UPCOMING APPOINTMENTS (The Real Logic)
        const upcomingAppointments = await AppointmentLog.countDocuments({
            user: userId,
            date: { $gte: new Date() } // Count only future dates
        })

        res.json({
            appointments: upcomingAppointments,
            pendingReports: pendingReports,
            healthScore: healthScore
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export { getDashboardStats };