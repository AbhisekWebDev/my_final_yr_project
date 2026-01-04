import medicalAgent from "../utils/medicalAgent.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import WorkoutLog from "../models/WorkoutLog.js";

// @desc    Generate Workout Plan
// @route   POST /api/workout
const generateWorkoutPlan = async (req, res) => {
    const { age, height, weight, frequency, goal, gender } = req.body;
    const userId = req.user ? String(req.user._id) : null;

    try {
        console.log(`[WORKOUT] Generating plan for user: ${userId}`);

        const systemPrompt = `You are a Certified Personal Trainer and Physiotherapist.
        
        USER PROFILE:
        - Age: ${age}
        - Height: ${height} cm
        - Weight: ${weight} kg
        - Gender: ${gender}
        - Availability: ${frequency}
        - Goal: ${goal}

        YOUR TASK: Create a safe, effective, and scientific workout routine.

        RESPONSE FORMAT (Markdown):
        
        ## 🏋️ Personalized Workout Plan
        **Goal:** ${goal}
        **Schedule:** ${frequency}

        ### ⚠️ Safety First
        - [Warm-up instruction]
        - [Precaution based on Age/BMI]

        ### 🗓️ Weekly Routine
        **Day 1:**
        - [Exercise] ([Sets] x [Reps])
        
        ... (Covering the requested days) ...

        ### 🥗 Recovery & Nutrition Tips
        - [Hydration/Protein advice]

        **Disclaimer:** Consult a doctor before starting new heavy exercises.`;

        const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage("Create my workout plan."),
        ];

        const result = await medicalAgent.invoke({ messages });
        const finalPlan = result.messages[result.messages.length - 1].content;

        if (userId) {
            await WorkoutLog.create({
                user: userId,
                age, height, weight, frequency, goal,
                aiPlan: finalPlan
            });
        }

        res.json({ plan: finalPlan });

    } catch (error) {
        console.error("Workout Agent Error:", error);
        res.status(500).json({ message: "Failed to generate plan" });
    }
};

export { generateWorkoutPlan };