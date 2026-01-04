import React, { useState } from 'react';
import { Dumbbell, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

const WorkoutPlanner = () => {
  const [formData, setFormData] = useState({
    age: '', height: '', weight: '', gender: 'Male',
    frequency: 'Regular (2-4 days/week)',
    goal: 'Weight Loss'
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/workout', formData, config);
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Dumbbell className="text-purple-600" /> Workout Planner
        </h2>
        
        <form onSubmit={generatePlan} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Age</label>
                <input name="age" type="number" required onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="25" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" onChange={handleChange} className="w-full p-2 border rounded-lg">
                    <option>Male</option><option>Female</option>
                </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                <input name="height" type="number" required onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="175" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                <input name="weight" type="number" required onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="70" />
            </div>
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700">Your Goal</label>
             <select name="goal" onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option>Weight Loss</option>
                <option>Weight Gain (Muscle Building)</option>
                <option>Maintenance (Stay Fit)</option>
             </select>
          </div>

          <div>
             <label className="text-sm font-medium text-gray-700">Workout Frequency</label>
             <select name="frequency" onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option>Minimum (1-2 days/week)</option>
                <option>Regular (2-4 days/week)</option>
                <option>Heavy (5-6 days/week)</option>
             </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors flex justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Generate Workout"}
          </button>
        </form>
      </div>

      {/* Result Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]">
         {!plan ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <Dumbbell size={48} className="mb-4 opacity-20" />
               <p>Enter details to get your plan</p>
            </div>
         ) : (
            <div className="text-left prose prose-purple max-w-none">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown>
            </div>
         )}
      </div>
    </div>
  );
};

export default WorkoutPlanner;