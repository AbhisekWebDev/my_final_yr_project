import React, { useState } from 'react'
import { Search, Pill, AlertTriangle, ShieldCheck, FileText, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import axios from 'axios'

function MedicineInfo() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [medicineData, setMedicineData] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setMedicineData(null)
    setError('')

    try {

      // 1. Get the User Info (Token) from Local Storage
      const userInfo = localStorage.getItem("userInfo") 
        ? JSON.parse(localStorage.getItem("userInfo")) 
        : null

      // Optional: Stop if not logged in
      if (!userInfo || !userInfo.token) {
        setError("You must be logged in to search.")
        setLoading(false)
        return
      }

      // 2. Prepare the Headers
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // <--- THE MISSING KEY
        },
      }

      // We send a special prefix "MEDICINE_QUERY:" so the backend knows to switch modes
      const { data } = await axios.post('http://localhost:5000/api/chat', { 
        message: `MEDICINE_QUERY: ${query}` 
      }, config)
      setMedicineData(data.reply)
    } catch (err) {
      setError('Failed to fetch medicine details. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-6 max-w-5xl mx-auto h-full overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Pill className="text-blue-600 w-8 h-8" /> 
          Medicine Scanner
        </h1>
        <p className="text-gray-500">
          Instant details on dosage, side effects, and prescription status.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3 mb-10 md:mb-10 relative">
        <input 
          type="text" 
          placeholder="Enter medicine name (e.g., Ganaton Total, Dolo 650)..."
          className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="justify-center bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Result Card */}
      {medicineData && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
           
           {/* Card Header */}
           <div className="bg-blue-50/50 p-6 border-b border-blue-100 flex items-center gap-3">
             <FileText className="text-blue-600" />
             <h2 className="text-xl font-bold text-slate-800">Drug Information Sheet</h2>
           </div>

           {/* Content - STYLING FIX */}
           <div className="p-8 w-full text-left">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Header Styles
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3 uppercase tracking-wide border-b border-gray-100 pb-1" {...props} />,
                  
                  // List Styles (CRITICAL FIX)
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700 text-left" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-slate-700 text-left" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1 text-left" {...props} />,
                  
                  // Paragraph & Text Styles
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-slate-600 text-left" {...props} />,
                  strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />
                }}
              >
                {medicineData}
              </ReactMarkdown>
           </div>
           
           {/* Disclaimer Footer */}
           <div className="bg-orange-50 p-6 border-t border-orange-100 flex gap-4">
             <AlertTriangle className="text-orange-600 w-6 h-6 shrink-0" />
             <div className="text-sm text-orange-800">
               <p className="font-bold mb-1">Medical Disclaimer</p>
               <p>
                 This information is for educational purposes only and does not substitute professional medical advice. 
                 Always consult a registered medical practitioner (RMP) before starting any new medication.
               </p>
             </div>
           </div>
        </div>
      )}

      {/* Empty State / Hint */}
      {!medicineData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center opacity-60">
           <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-gray-400" />
             <h3 className="font-semibold text-sm">Safety Checks</h3>
             <p className="text-xs mt-1">Check if a drug is Rx or OTC</p>
           </div>
           <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <Pill className="w-8 h-8 mx-auto mb-3 text-gray-400" />
             <h3 className="font-semibold text-sm">Side Effects</h3>
             <p className="text-xs mt-1">Know potential risks</p>
           </div>
           <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <FileText className="w-8 h-8 mx-auto mb-3 text-gray-400" />
             <h3 className="font-semibold text-sm">Compositions</h3>
             <p className="text-xs mt-1">Understand ingredients</p>
           </div>
        </div>
      )}
    </div>
  )
}

export default MedicineInfo