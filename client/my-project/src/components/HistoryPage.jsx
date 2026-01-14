import React, { useEffect, useState } from 'react';
import { FileText, Pill, Calendar, Activity, ChevronRight, Loader2, Download, Utensils, Dumbbell } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [data, setData] = useState({ symptoms: [], medicines: [] });
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('symptoms')

    const navigate = useNavigate(); // Initialize Hook

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Get token from storage (Adjust based on your Auth setup)
        const token = localStorage.getItem('userInfo') 
            ? JSON.parse(localStorage.getItem('userInfo')).token 
            : null;

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const { data } = await axios.get('http://localhost:5000/api/history', config);
        setData(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-5 md:p-6 max-w-6xl mx-auto mb-20 md:mb-0">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
             <Activity className="text-blue-600" /> Medical History
           </h1>
           <p className="text-gray-500 mt-1">Track your past consultations and medicine scans.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
            onClick={() => setActiveTab('symptoms')}
            className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'symptoms' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Symptom Checks
            {activeTab === 'symptoms' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
        </button>
        <button 
            onClick={() => setActiveTab('medicines')}
            className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'medicines' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Medicine Scans
            {activeTab === 'medicines' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
        </button>
        <button 
            onClick={() => setActiveTab('diets')}
            className={`pb-3 px-4 font-medium transition-colors whitespace-nowrap relative ${activeTab === 'diets' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Diet Plans
            {activeTab === 'diets' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('workouts')}
          className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'workouts' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
      >
          Workout Plans
          {activeTab === 'workouts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
      </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="space-y-4">
            
            {/* SYMPTOMS LIST and REPORTS LIST */}
            {activeTab === 'symptoms' && (
                data.symptoms.length > 0 ? (
                    data.symptoms.map((item) => (
                        <div key={item._id} onClick={() => navigate(`/history/symptom/${item._id}`)} // CLICK EVENT ADDED
                         className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg capitalize">{item.query}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(item.createdAt)}</span>
                                        {item.confidenceScore && (
                                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                {item.confidenceScore} Confidence
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-400">No symptom checks found.</div>
                )
            )}

            {/* MEDICINES LIST */}
            {activeTab === 'medicines' && (
                data.medicines.length > 0 ? (
                    data.medicines.map((item) => (
                        <div key={item._id}
                        onClick={() => navigate(`/history/medicine/${item._id}`)} // CLICK EVENT ADDED
                         className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Pill size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg capitalize">{item.medicineName}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(item.createdAt)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.prescriptionStatus === 'Rx' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {item.prescriptionStatus === 'Rx' ? 'Prescription Required' : 'Over The Counter'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-400">No medicine scans found.</div>
                )
            )}

            {/* DIETS LIST (NEW) */}
            {activeTab === 'diets' && (
                data.diets?.length > 0 ? (
                    data.diets.map((item) => (
                        <div key={item._id} onClick={() => navigate(`/history/diet/${item._id}`)} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><Utensils size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg capitalize">{item.goal} Diet Plan</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(item.createdAt)}</span>
                                        {item.medicalConditions && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold truncate max-w-[150px]">{item.medicalConditions}</span>}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                    ))
                ) : <div className="text-center py-12 text-gray-400">No diet plans found.</div>
            )}

            {/* WORKOUTS LIST */}
      {activeTab === 'workouts' && (
          data.workouts?.length > 0 ? (
              data.workouts.map((item) => (
                  <div key={item._id} onClick={() => navigate(`/history/workout/${item._id}`)} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group cursor-pointer">
                      <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Dumbbell size={20} /></div>
                          <div>
                              <h3 className="font-bold text-slate-800 text-lg capitalize">{item.goal} Routine</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(item.createdAt)}</span>
                                  <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">{item.frequency}</span>
                              </div>
                          </div>
                      </div>
                      <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
              ))
          ) : <div className="text-center py-12 text-gray-400">No workout plans found.</div>
      )}

        </div>
      )}
    </div>
  );
};

export default HistoryPage;