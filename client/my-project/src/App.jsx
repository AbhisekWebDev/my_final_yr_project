import { useState } from 'react'
import './App.css'

import HomePage from './components/HomePage'
import UserRegistration from './components/UserRegistration'
import UserLogin from './components/UserLogin'
import Dashboard from './components/Dashboard'
import MedicineInfo from './components/MedicineInfo'
import HistoryPage from './components/HistoryPage'
import HistoryDetails from './components/HistoryDetails'
import DietPlanner from './components/DietPlanner'
import WorkoutPlanner from './components/WorkoutPlanner'
import AppointmentPage from './components/AppointmentPage'
import ReportAnalyzer from './components/ReportAnalyzer'

import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <Routes>

      <Route path='/' element={<HomePage />} />
      
      {/* If URL is "/" -> Show Registration Page */}
      <Route path="/register" element={<UserRegistration />} />
      
      {/* If URL is "/login" -> Show Login Page */}
      <Route path="/login" element={<UserLogin />} />

      <Route path="/medi" element={<Dashboard />} />

      <Route path="/medicines" element={<MedicineInfo />} />

      <Route path="/history" element={<HistoryPage />} />

      {/* The New Route: :type will be 'symptom' or 'medicine' */}
      <Route path="/history/:type/:id" element={<HistoryDetails />} />

      <Route path="/diet" element={<DietPlanner />} />

      <Route path="/workout" element={<WorkoutPlanner />} />

      <Route path="/appointments" element={<AppointmentPage />} />

      <Route path="/report-analyzer" element={<ReportAnalyzer />} />
    
    </Routes>
  )
}

export default App
