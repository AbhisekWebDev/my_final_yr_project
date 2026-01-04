import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Activity, Pill, Loader2, Utensils, AlertTriangle, Dumbbell } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HistoryDetail = () => {
  const { type, id } = useParams() // Get URL params

  const navigate = useNavigate()

  const [data, setData] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
           headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        // Call our new backend endpoint
        const response = await axios.get(`http://localhost:5000/api/history/${type}/${id}`, config);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [type, id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!data) return <div className="text-center mt-20 text-red-500">Record not found.</div>;

  // Determine Title based on type
//   const title = type === 'symptom' ? data.query : data.medicineName;
//   const Icon = type === 'symptom' ? Activity : Pill;

  // =========================================================
  // LOGIC TO HANDLE DIFFERENT TYPES (Symptom vs Medicine vs Diet)
  // =========================================================
  let title = "Report";
  let Icon = Activity;
  let colorClass = "bg-gray-100 text-gray-600";
  let markdownContent = "";

  if (type === 'symptom') {
      title = data.query;
      Icon = Activity;
      colorClass = "bg-orange-100 text-orange-600";
      markdownContent = data.aiResponse; // Symptoms use aiResponse
  } 
  else if (type === 'medicine') {
      title = data.medicineName;
      Icon = Pill;
      colorClass = "bg-blue-100 text-blue-600";
      markdownContent = data.aiResponse; // Medicines use aiResponse
  } 
  else if (type === 'diet') {
      title = `${data.goal} Diet Plan`;
      Icon = Utensils;
      colorClass = "bg-green-100 text-green-600";
      markdownContent = data.aiPlan; // <--- DIETS USE 'aiPlan'
  } else if (type === 'workout') {
    title = `${data.goal} Routine`;
    Icon = Dumbbell;
    colorClass = "bg-purple-100 text-purple-600";
    markdownContent = data.aiPlan;
}

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to History
      </button>

      {/* Header Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
         <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${type === 'symptom' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
               <Icon size={28} />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-slate-800 capitalize mb-2">{title}</h1>
               <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {formatDate(data.createdAt)}</span>

                  {/* Diet Specific Tags */}
                  {type === 'diet' && data.allergies && (
                      <span className="bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-sm font-bold flex items-center gap-1">
                          <AlertTriangle size={12} /> Allergies: {data.allergies}
                      </span>
                  )}

                  {type === 'workout' && data.frequency && (
    <span className="bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-sm font-bold flex items-center gap-1">
        Target: {data.frequency}
    </span>
)}

                  {/* Show Confidence or Rx Status */}
                  {data.confidenceScore && (
                     <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-sm font-bold">
                        {data.confidenceScore} Confidence
                     </span>
                  )}
                  {data.prescriptionStatus && (
                     <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${data.prescriptionStatus === 'Rx' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {data.prescriptionStatus === 'Rx' ? 'Prescription Required' : 'OTC'}
                     </span>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Content Area (Markdown) */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
         <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-gray-100 pb-2">AI Analysis Report</h2>
         
         <div className="text-left prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
            <ReactMarkdown 
               remarkPlugins={[remarkGfm]}
               components={{
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />
               }}
            >
               {markdownContent}
            </ReactMarkdown>
         </div>
      </div>

    </div>
  );
};

export default HistoryDetail;