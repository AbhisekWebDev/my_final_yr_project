import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Stethoscope, Sparkles, ExternalLink } from 'lucide-react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import axios from 'axios'

function ChatInterface() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I am AIM, your AI medical assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Suggestion State
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef(null)

  // 1. FETCH HISTORY ON LOAD (The Persistence Logic)
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo") 
          ? JSON.parse(localStorage.getItem("userInfo")) 
          : null;

        if (!userInfo) return;

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // Fetch Data
        const { data } = await axios.get('http://localhost:5000/api/history', config);

        // 2. TRANSFORM DATA (Convert DB logs to Chat Messages)
        // We handle both Symptoms and Medicines to create a unified "Timeline"
        const historyMessages = [];

        // Add Symptoms
        data.symptoms.forEach(log => {
          historyMessages.push({
            id: log._id + '_query',
            sender: 'user', // Match your component's state key ('sender' not 'type')
            text: log.query,
            createdAt: new Date(log.createdAt)
          });
          historyMessages.push({
            id: log._id + '_response',
            sender: 'bot',
            text: log.aiResponse,
            createdAt: new Date(log.createdAt) // Same time as query roughly
          })
        })

        // Add Medicines
        data.medicines.forEach(log => {
          historyMessages.push({
            id: log._id + '_query',
            sender: 'user',
            text: `Medicine Search: ${log.medicineName}`,
            createdAt: new Date(log.createdAt)
          });
          historyMessages.push({
            id: log._id + '_response',
            sender: 'bot',
            text: log.aiResponse,
            createdAt: new Date(log.createdAt)
          });
        });

        // 3. SORT BY DATE (Oldest First -> Newest Last)
        historyMessages.sort((a, b) => a.createdAt - b.createdAt);

        // 4. UPDATE STATE (Keep the welcome message, then add history)
        if (historyMessages.length > 0) {
            setMessages(prev => [prev[0], ...historyMessages]);
        }

      } catch (error) {
        console.error("Failed to load history:", error)
      }
    };

    loadChatHistory();
  }, []) // Empty dependency array = Runs once on mount

  // auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  // ==========================================
  // 1. THE REAL MEDICAL API (NIH Clinical Tables)
  // ==========================================
  useEffect(() => {
    // Debounce: Wait 500ms after user stops typing before calling API
    const delayDebounceFn = setTimeout(async () => {

      // LOGIC CHANGE: Split by comma to find the last term being typed
      const terms = inputText.split(',');
      const currentTerm = terms[terms.length - 1].trim()

      if (currentTerm && currentTerm.length > 2) {
        try {
          const response = await axios.get(`https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${currentTerm}&maxList=5`)
          const medicalTerms = response.data[3] || []
          
          if (medicalTerms.length > 0) {
            setSuggestions(medicalTerms)
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        } catch (error) {
          console.error("Suggestion API Error:", error)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [inputText])


  const selectSuggestion = (term) => {
    // FIX : Ensure term is a string before setting state
    const safeTerm = typeof term === 'string' ? term : String(term)

    //  Get all current terms
    const terms = inputText.split(',')

    //  Remove the partial term the user was just typing (the last one)
    terms.pop()

    //  Add the selected complete term
    terms.push(safeTerm)

    // 4. Join them back with commas and add a trailing comma+space for the next item
    // Filter trims empty spaces if any exist
    const newText = terms.map(t => t.trim()).filter(t => t).join(', ') 

    if (typeof newText === 'string') {
        setInputText(newText)
    } else {
        setInputText(String(newText))
    }
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    // 1. Add User Message
    const userMessage = { id: Date.now(), text: inputText, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    
    // Store current input to send, then clear state
    const messageToSend = inputText
    setInputText('')
    setSuggestions([])
    setShowSuggestions(false)
    setIsLoading(true)

    try {

      const userInfo = localStorage.getItem("userInfo") 
        ? JSON.parse(localStorage.getItem("userInfo")) 
        : null

        // 2. Call the Real Backend
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

        // Note: Change URL to your actual backend port (usually 5000)
        const { data } = await axios.post(
            'http://localhost:5000/api/chat',
            { message: messageToSend },
            config
        )

        // 3. Add AI Response to UI
        const botMessage = { 
            id: Date.now() + 1, 
            text: data.reply, 
            sender: 'bot' 
        }
        setMessages(prev => [...prev, botMessage])

    } catch (error) {
        console.error("Chat Error:", error)
        const errorMessage = { 
            id: Date.now() + 1, 
            text: "Sorry, I am having trouble connecting to the server.", 
            sender: 'bot' 
        }
        setMessages(prev => [...prev, errorMessage])
    } finally {
        setIsLoading(false)
    }
    
    // FIX 5: Helper to safely check if input is empty
  const isInputEmpty = !inputText || !String(inputText).trim()

}

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">AIM Assistant</h3>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}>
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
              
              {/* RENDER MARKDOWN INSTEAD OF PLAIN TEXT */}
              {/* MARKDOWN RENDERER */}
              <div className="w-full text-left prose prose-sm max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headings
    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-800 mt-4 mb-2" {...props} />,
                  // Force Left Align & List Styling
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 my-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 my-2" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,

                  // CUSTOM BUTTON STYLING FOR LINKS
    a: ({node, ...props}) => (
      <a 
        {...props} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all font-medium my-1 no-underline shadow-sm"
      >
        {props.children} <ExternalLink size={14} />
      </a>
    ),

                  strong: ({node, ...props}) => <span className="font-bold" {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 relative">
        
        {/* ================================== */}
        {/* AUTOCOMPLETE DROPDOWN         */}
        {/* ================================== */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-4 py-2 bg-blue-50 text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
               <Stethoscope size={14} /> Clinical Suggestions
            </div>
            {suggestions.map((term, index) => (
              <button
                key={index}
                onClick={() => selectSuggestion(term)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-slate-700 font-medium flex items-center justify-between group"
              >
                {term}
                <Sparkles size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your symptoms or health questions..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-900/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

    </div>
  )
}

export default ChatInterface