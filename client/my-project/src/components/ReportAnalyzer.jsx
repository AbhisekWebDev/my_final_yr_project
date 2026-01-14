import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const ReportAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Handle Image Upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      processImage(e.target.files[0]);
    }
  };

  // 2. Extract Text using Tesseract (OCR)
  const processImage = (file) => {
    setLoading(true);
    setAnalysis('');
    
    Tesseract.recognize(
      file,
      'eng',
      { logger: m => {
          if(m.status === 'recognizing text') setProgress(parseInt(m.progress * 100));
        } 
      }
    ).then(({ data: { text } }) => {
      setOcrText(text);
      analyzeWithAI(text); // Send extracted text to AI
    });
  };

  // 3. Send Text to Your Backend AI
  const analyzeWithAI = async (text) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // We send a special prefix so the backend knows how to handle it
      const prompt = `REPORT_ANALYSIS: ${text}`; 
      
      const { data } = await axios.post('http://localhost:5000/api/chat', { message: prompt }, config);
      setAnalysis(data.reply);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="text-blue-600" /> Smart Report Analyzer
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Upload Section */}
        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors">
          {image ? (
            <img src={image} alt="Report" className="max-h-64 rounded-lg shadow-sm" />
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Upload size={32} />
              </div>
              <p className="text-gray-500 mb-2">Upload your Lab Report (Image)</p>
              <input type="file" onChange={handleImageChange} className="hidden" id="report-upload" accept="image/*" />
              <label htmlFor="report-upload" className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                Browse Files
              </label>
            </>
          )}

          {/* Progress Bar */}
          {loading && !analysis && (
            <div className="w-full mt-6">
               <div className="flex justify-between text-xs text-gray-500 mb-1">
                 <span>Scanning...</span>
                 <span>{progress}%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          )}
        </div>

        {/* Right: AI Analysis Result */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
           <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
             <CheckCircle size={20} className="text-green-500" /> AI Interpretation
           </h3>
           
           {loading ? (
             <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
               <Loader2 className="animate-spin" /> Analyzing values...
             </div>
           ) : analysis ? (
             <div className="prose prose-sm max-w-none text-slate-700">
               {/* Just render it simply or use ReactMarkdown */}
               <p className="whitespace-pre-wrap">{analysis}</p>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-40 text-gray-400">
               <AlertCircle size={32} className="mb-2 opacity-20" />
               <p>Upload a report to see the magic.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalyzer;