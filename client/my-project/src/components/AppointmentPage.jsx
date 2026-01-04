import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Stethoscope, Plus, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ doctorName: '', specialty: '', date: '', time: '', location: '' });
  
  const navigate = useNavigate();

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/appointments', config);
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Combine Date and Time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      await axios.post('http://localhost:5000/api/appointments', {
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        location: formData.location,
        date: dateTime
      }, config);
      
      setShowForm(false);
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error("Error saving appointment");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
        <button onClick={() => setShowForm(!showForm)} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4"> <Stethoscope size={20} className="text-blue-600"/> Add Upcoming Visit</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input className="p-3 border rounded-lg" placeholder="Doctor's Name" onChange={e => setFormData({...formData, doctorName: e.target.value})} required />
            <input className="p-3 border rounded-lg" placeholder="Specialty (e.g. Dentist)" onChange={e => setFormData({...formData, specialty: e.target.value})} required />
            <input className="p-3 border rounded-lg" placeholder="Hospital/Clinic Location" onChange={e => setFormData({...formData, location: e.target.value})} />
            <div className="flex gap-2">
                <input type="date" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, date: e.target.value})} required />
                <input type="time" className="p-3 border rounded-lg w-full" onChange={e => setFormData({...formData, time: e.target.value})} required />
            </div>
            <button type="submit" className="md:col-span-2 bg-slate-900 text-white py-3 rounded-lg font-bold">Save Appointment</button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <div key={apt._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{apt.doctorName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{apt.specialty}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(apt.date).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {apt.location}</span>
                  </div>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Upcoming</span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No upcoming appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;