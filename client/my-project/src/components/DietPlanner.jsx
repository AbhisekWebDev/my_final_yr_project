import React, { useState } from 'react';
import { Utensils, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

const DietPlanner = () => {
  const [formData, setFormData] = useState({
    goal: 'Weight Loss',
    age: '',
    gender: 'Male',
    weight: '',
    allergies: '',
    conditions: ''
  });
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDietPlan(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
      };

      const { data } = await axios.post('http://localhost:5000/api/diet', formData, config);
      setDietPlan(data.plan);

    } catch (err) {
      setError("Failed to generate plan. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Utensils className="text-green-600" /> AI Diet Planner
        </h1>
        <p className="text-gray-500 pt-4">Get a professional meal plan tailored to your health needs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Column: Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-4 text-slate-700">Your Requirements</h2>
          
          <form onSubmit={generatePlan} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Age</label>
                    <input name="age" type="number" required onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" placeholder="25" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input name="weight" type="number" required onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" placeholder="70" />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" onChange={handleChange} className="w-full p-2 border rounded-lg mt-1">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">Health Goal</label>
                <select name="goal" onChange={handleChange} className="w-full p-2 border rounded-lg mt-1">
                    <option>Weight Loss</option>
                    <option>Weight Gain</option>
                    <option>Muscle Building</option>
                    <option>Maintain Weight</option>
                    <option>Manage Disease (e.g. Diabetes)</option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">Allergies (Optional)</label>
                <input name="allergies" type="text" onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" placeholder="Peanuts, Dairy, Gluten..." />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">Medical Conditions (Optional)</label>
                <input name="conditions" type="text" onChange={handleChange} className="w-full p-2 border rounded-lg mt-1" placeholder="Diabetes, PCOD, Hypertension..." />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Generate Plan"}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>

        {/* Right Column: Result */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px]">
           {!dietPlan ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Utensils size={48} className="mb-4 opacity-20" />
                <p>Fill the form to generate your AI Plan</p>
             </div>
           ) : (
             <div className="text-left prose prose-green max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {dietPlan}
                </ReactMarkdown>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default DietPlanner;