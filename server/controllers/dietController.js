import medicalAgent from "../utils/medicalAgent.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import DietLog from "../models/DietLog.js";

// @desc    Generate Diet Plan
// @route   POST /api/diet
// @access  Private
const generateDietPlan = async (req, res) => {
    const { goal, allergies, conditions, age, gender, weight } = req.body;
    
    // 1. Get User ID
    const userId = req.user ? String(req.user._id) : null;

    try {
        console.log(`[DIET] Generating plan for user: ${userId}`);

        // 2. Construct the Prompt
        const systemPrompt = `You are a Certified Clinical Nutritionist and Dietician.
        
        YOUR GOAL: Create a highly detailed, safe, and professional 1-Day Meal Plan based on the user's requirements.

        USER PROFILE:
        - Goal: ${goal}
        - Allergies: ${allergies || "None"}
        - Medical Conditions: ${conditions || "None"}
        - Demographics: ${age} years old, ${gender}, ${weight} kg

        CRITICAL SAFETY RULES:
        1. If the user has a specific disease (e.g., Diabetes), you MUST strictly avoid foods that trigger it (e.g., high sugar).
        2. If the user has allergies, you MUST explicitly state that the plan is free of those allergens.
        3. Do NOT recommend dangerous calorie deficits.

        RESPONSE FORMAT (Strict Markdown):
        
        ## 🥗 Personalized Nutrition Plan
        **Goal:** [Goal]
        **Daily Calorie Target:** [Estimate] kcal

        ### 🚫 Foods to Strictly Avoid
        - [List items based on diseases/allergies]

        ### ✅ Foods to Include
        - [List beneficial foods]

        ### 📅 1-Day Meal Plan
        **Breakfast:**
        - [Meal option] (approx. cal)
        
        **Lunch:**
        - [Meal option] (approx. cal)

        **Snack:**
        - [Option]

        **Dinner:**
        - [Meal option] (Light & easy to digest)

        ### ⚠️ Safety Precautions & Lifestyle Tips
        - [Hydration advice]
        - [Specific disease precautions]
        
        **Disclaimer:** I am an AI. This is a suggestion. Please consult a doctor before making drastic diet changes.`;

        const userMessage = `Create my diet plan.`;

        const messages = [
            new SystemMessage(systemPrompt),
            new HumanMessage(userMessage),
        ];

        // 3. Get AI Response
        const result = await medicalAgent.invoke({ messages });
        const finalPlan = result.messages[result.messages.length - 1].content;

        // 4. Save to Database
        if (userId) {
            await DietLog.create({
                user: userId,
                goal,
                allergies,
                medicalConditions: conditions,
                aiPlan: finalPlan
            });
            console.log("✅ Diet Plan Saved to DB");
        }

        res.json({ plan: finalPlan });

    } catch (error) {
        console.error("Diet Agent Error:", error);
        res.status(500).json({ message: "Failed to generate diet plan" });
    }
};

export { generateDietPlan };