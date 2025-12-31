import { TavilySearch } from "@langchain/tavily"
import { ChatGroq } from "@langchain/groq"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph"
import { tool } from "@langchain/core/tools"; // Import tool helper
import { z } from "zod"; // Import Zod for schema validation
import axios from 'axios'
import dotenv from "dotenv"

dotenv.config()

// 1. Setup the Brain (Groq)
// We use llama3-70b because it is smarter at following complex instructions
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", 
  temperature: 0.4, // Keeps answers factual
})

// 2. Define the Tools
// Tool: Tavily Search (Used for finding Doctors, Hospitals, and verifying Medicines)
// const tavilyTool = new TavilySearch({
//   maxResults: 3, // Fetch top 3 results
//   apiKey: process.env.TAVILY_API_KEY,
// })

const safeTavilyTool = tool(
    async ({ query }) => {
        try {
            console.log(`🔎 Searching Tavily for: ${query}`);
            
            const response = await axios.post("https://api.tavily.com/search", {
                api_key: process.env.TAVILY_API_KEY,
                query: query,
                search_depth: "basic",
                include_answer: true,
                max_results: 5, 
                // We strictly control the parameters here, so no "timeRange" error can happen.
            });

            // Return just the results context to save tokens
            const results = response.data.results.map(r => 
                `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
            ).join("\n\n");

            return results || "No results found.";

        } catch (error) {
            console.error("Tavily Search API Error:", error.message);
            return "Error: Could not fetch search results. Please advise the user to consult a doctor.";
        }
    },
    {
        name: "medical_web_search",
        description: "Search the web for medical information, doctors, and medicines.",
        schema: z.object({
            query: z.string().describe("The search query string."),
        }),
    }
)

const tools = [safeTavilyTool]

// 3. Bind Tools to the LLM
const llmWithTools = llm.bindTools(tools)

// 4. Define Nodes
// Node A: The "Agent" (The Brain)
async function agentNode(state) {
  const { messages } = state;
  const response = await llmWithTools.invoke(messages);
  return { messages: [response] }
}

// Node B: The "Tools" (The Action)
const toolsNode = new ToolNode(tools)

// 5. Define Logic (The Decision)
const shouldContinue = (state) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  // If the AI wants to use a tool (has 'tool_calls'), go to "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we are done
  return "__end__";
}

// 6. Build the Graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolsNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent"); // Loop back to agent to summarize findings

const medicalAgent = workflow.compile();

export default medicalAgent