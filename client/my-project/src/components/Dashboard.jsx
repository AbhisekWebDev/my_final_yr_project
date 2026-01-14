import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'

import MedicineInfo from './MedicineInfo'
import HealthDashboard from './HealthDashboard'
import ReportAnalyzer from './ReportAnalyzer'

import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Activity,
    History,
    Utensils,
    Dumbbell,
    Pill,
    HeartPulse,
    FileSearch
} from 'lucide-react'

import ChatInterface from './ChatInterface'

function Dashboard() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [user, setUser] = useState(null)

    // Track which tab is active (default is 'overview')
    const [activeTab, setActiveTab] = useState('overview')
 
    const navigate = useNavigate()

    // 1. Check if user is logged in
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')
        
        if (userInfo) {
        setUser(JSON.parse(userInfo))
        } else {
        // If no user found, kick them back to login
        navigate('/login')
        }
    }, [navigate])

    // 2. Logout Function
    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        navigate('/login')
    }

    
    const [stats, setStats] = useState({ appointments: 0, reports: 0, score: '--' });
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                
                const { data } = await axios.get('http://localhost:5000/api/dashboard/stats', config);
                
                setStats({
                    appointments: data.appointments,
                    reports: data.pendingReports,
                    score: data.healthScore
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        if(user) fetchStats();
    }, [user])

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* ================= SIDEBAR ================= */}
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
              <Activity className="text-white w-6 h-6" strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-blue-900">
                AIM
              </span>
          </div>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<MessageSquare size={20} />} text="AI Chat Assistant" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <SidebarItem icon={<FileText size={20} />} text="Report Download" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />

          {/* --- 2. New Health Stats Tab --- */}
          <SidebarItem 
            icon={<HeartPulse size={20} />} 
            text="Health Stats" 
            active={activeTab === 'health'} 
            onClick={() => setActiveTab('health')} 
          />

          <Link to="/medicines" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-medium">
          <Pill size={20} />
          <span>Medicine Scanner</span>
          </Link>

          <Link to="/diet" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-medium">
          <Utensils size={20} />
          <span>Diet Planner</span>
          </Link>

          <Link to="/workout" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-medium">
          <Dumbbell size={20} />
          <span>Workout Planner</span>
          </Link>

          <Link 
            to="/report-analyzer" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all font-medium"
          >
             <FileSearch size={20} /> 
             <span>Report Analyzer</span>
          </Link>
          
          <Link to="/history" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all font-medium">
          <History size={20} />
          <span>History</span>
          </Link>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header (Mobile Only) */}
        <header className="bg-white shadow-sm p-4 flex items-center gap-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-800">Dashboard</span>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto h-full">
            
            {activeTab === 'overview' && (
              <>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mb-8">Here is your health overview for today.</p>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div onClick={() => navigate('/appointments')} className="cursor-pointer transition-transform hover:scale-[1.02]">
    <StatCard title="Upcoming Appointments" value={stats.appointments} color="blue" />
</div>
              {/* <StatCard title="Upcoming Appointments" value={stats.appointments} color="blue" /> */}
              <StatCard title="Pending Reports" value={stats.reports} color="yellow" />
              <StatCard title="Health Score" value={stats.score} color="green" />
            </div>

            {/* Placeholder for AI Feature */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center py-10 mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Start a New Diagnosis</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Use our advanced AI to analyze symptoms or medical reports instantly.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              onClick={() => setActiveTab('chat')}
              >
                Start AI Chat
              </button>
            </div>
            </>
            )}

            {/* VIEW: HEALTH DASHBOARD */}
            {activeTab === 'health' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                 <HealthDashboard />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-full pb-4">
                 <ChatInterface />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper Components
function SidebarItem({ icon, text, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  )
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    green: "bg-green-50 text-green-600 border-green-100"
  }
  
  return (
    <div className={`p-6 rounded-2xl border ${colors[color]}`}>
      <h3 className="text-4xl font-bold mb-2">{value}</h3>
      <p className="font-medium opacity-80">{title}</p>
    </div>
  )
}

export default Dashboard