import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { 
  Activity, 
  Brain, 
  CalendarCheck, 
  ChevronRight, 
  ShieldCheck, 
  Facebook, 
  Twitter, 
  Instagram, 
  Menu,
  Phone, 
  MessageCircle,
  X
} from 'lucide-react'

function HomePage() {

    // STATE: Tracks if mobile menu is open or closed
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-blue-900">
                AIM
              </span>
            </div>

          {/* Desktop Nav Buttons (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 transition-all flex items-center gap-2"
              >
                Get Started <ChevronRight size={18} />
              </Link>
            </div>

          {/* Mobile Menu Icon (Visible only on Mobile) */}
          <button 
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* MOBILE DROPDOWN MENU */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top-5 fade-in duration-200">
              <div className="flex flex-col gap-4 mt-4">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <header className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-8 z-10">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-2">
              ✨ AI-Powered Healthcare
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Optimized by AIM.
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Experience the future of personal wellness. From smart diagnostics to personalized diet plans, AIMed is your intelligent companion for a healthier life.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-transform hover:-translate-y-1">
                Start Your Journey
              </Link>
              <button className="px-8 py-4 bg-white text-blue-700 border-2 border-blue-100 rounded-xl font-bold text-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Abstract Background Blob */}
            <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-br from-blue-200 to-cyan-100 rounded-full blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070" 
              alt="Doctor using AI" 
              className="rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500"
            />
          </div>
        </div>
      </header>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose AIMed?</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We combine cutting-edge machine learning with medical expertise to bring you features that actually make a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Task Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Automate appointment scheduling, medication reminders, and health tracking effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Smart Plans</h3>
              <p className="text-gray-600 leading-relaxed">
                Get AI-generated diet and workout plans tailored specifically to your body type and goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Data Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is encrypted and secure. We prioritize your privacy above everything else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-12">Our Core Philosophy</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-left space-y-4">
              <div className="text-blue-400 font-bold tracking-widest uppercase text-sm">Vision</div>
              <p className="text-xl text-gray-300 leading-relaxed">
                "To make AI accessible to everyone, enhancing productivity and simplifying daily life through intelligent automation."
              </p>
            </div>
            <div className="text-left space-y-4">
              <div className="text-blue-400 font-bold tracking-widest uppercase text-sm">Mission</div>
              <p className="text-xl text-gray-300 leading-relaxed">
                "To empower individuals by providing an AI assistant that understands their needs and helps them achieve goals efficiently."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-blue-600" />
                <span className="text-xl font-bold text-slate-900">AIM</span>
              </div>
              <p className="text-gray-500 max-w-sm">
                Your trusted partner in AI-driven healthcare solutions. Making advanced medical analysis accessible to everyone.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
                <li className="hover:text-blue-600 cursor-pointer">Cookie Policy</li>
              </ul>
            </div>

            {/* This div centers the content inside it */}
            <div className="flex flex-col items-center"> 
            <h4 className="font-bold text-slate-900 mb-4">Connect with us on</h4>
            
            {/* The justify-center ensures icons stay centered */}
            <div className="flex gap-4 justify-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-blue-600 cursor-pointer transition-colors">
                <Facebook size={20} />
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-blue-400 cursor-pointer transition-colors">
                <Twitter size={20} />
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-pink-600 cursor-pointer transition-colors">
                <Instagram size={20} />
                </div>
            </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6 pb-8">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Contact Us</h4>
            
            <div className="flex flex-wrap items-center gap-4 justify-center">
                
                {/* 1. Phone Number Button (Click to Call) */}
                <a 
                href="tel:+919000000000" 
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 hover:text-blue-600 hover:border-blue-200 transition-all group"
                >
                <Phone size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span className="font-semibold tracking-wide">9XXXXXXXXX</span>
                </a>

                {/* 2. WhatsApp Button (Click to Chat) */}
                <a 
                href="https://wa.me/919000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-200 rounded-full shadow-sm text-green-700 hover:bg-green-100 hover:shadow-md transition-all"
                >
                <MessageCircle size={20} />
                <span className="font-bold">WhatsApp</span>
                </a>

            </div>
        </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
            &copy; 2024 AIM Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}

export default HomePage