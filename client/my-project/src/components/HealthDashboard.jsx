import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, Heart, Moon, Flame, MapPin } from 'lucide-react'; // Icons

const HealthDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- HELPER: GET TOKEN ---
  const getToken = () => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo).token : null;
  };

  // Function to simulate the sync
  const syncData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return alert("Please login first");

      const config = { headers: { Authorization: `Bearer ${token}` } }; // FIXED HEADER

      await axios.post('http://localhost:5000/api/health/sync-mock', {}, config);
      
      // Automatically fetch new data after sync
      fetchData(); 
    } catch (err) {
      console.error("Sync Error:", err);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } }; // FIXED HEADER

      const res = await axios.get('http://localhost:5000/api/health/stats', config);
      
      // Format date for charts (e.g., "Jan 12")
      const formattedData = res.data.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
      
      setData(formattedData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Health Overview</h1>
        <button 
          onClick={syncData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
        >
          <Activity size={18} /> Sync Google Fit (Mock)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Flame className="text-orange-500"/>} title="Avg Calories" value={calculateAvg(data, 'calories')} unit="kcal" />
        <StatCard icon={<Moon className="text-indigo-500"/>} title="Avg Sleep" value={calculateAvg(data, 'sleep')} unit="hrs" />
        <StatCard icon={<Heart className="text-red-500"/>} title="Avg Heart Rate" value={calculateAvg(data, 'heartRate')} unit="bpm" />
        <StatCard icon={<MapPin className="text-green-500"/>} title="Avg Distance" value={calculateAvg(data, 'distance')} unit="km" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Steps & Calories Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Activity Trends (Steps vs Calories)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#3b82f6" activeDot={{ r: 8 }} name="Steps" />
              <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#f97316" name="Calories (kcal)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep Analysis Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Sleep Quality</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis domain={[0, 12]} />
              <Tooltip />
              <Bar dataKey="sleep" fill="#8884d8" name="Sleep (Hours)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

// Helper Component for Cards
const StatCard = ({ icon, title, value, unit }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
    </div>
  </div>
);

// Helper function
const calculateAvg = (data, key) => {
  if (!data.length) return 0;
  const sum = data.reduce((acc, curr) => acc + curr[key], 0);
  return (sum / data.length).toFixed(1);
};

export default HealthDashboard;