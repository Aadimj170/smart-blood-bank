import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Saare Pages ke Imports (Ensure kerna ki ye sabhi files tere src folder mein hain)
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Copilot from './Copilot'; // Ye wo file hai jo abhi tune banayi hai
import DonorDirectory from './DonorDirectory';
import DonorRecommend from './DonorRecommend';
import DemandPredict from './DemandPredict';
import Optimization from './Optimization';
import InventoryMatrix from './InventoryMatrix';
import BloodRouting from './BloodRouting';
import EligibilityChecker from './EligibilityChecker';
import LabProcessing from './LabProcessing';
import CrossmatchIssue from './CrossmatchIssue';
import AuditLogs from './AuditLogs';

// Sidebar Link Component (Active Page Highlight kerne ke liye)
function NavLink({ to, icon, text }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <li>
      <Link 
        to={to} 
        className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold tracking-wide ${
          isActive 
            ? 'bg-red-600 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)]' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <span className="text-2xl">{icon}</span>
        {text}
      </Link>
    </li>
  );
}

function MainLayout() {
  return (
    <div className="flex min-h-screen font-sans bg-[#f8fafc]">
      
      {/* Premium Dark Sidebar Menu */}
      <nav className="w-80 bg-[#0b1120] text-white p-8 flex flex-col shadow-2xl z-10 overflow-y-auto border-r border-gray-800/50 h-screen sticky top-0">
        <div className="mb-10 mt-2 px-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent tracking-tight">HemaSmart</h1>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-bold">Enterprise Console</p>
        </div>
        
        <ul className="space-y-1.5 flex-1">
          
          {/* 1. AI Intelligence Section */}
          <div className="mb-3 px-5 text-[11px] font-black text-indigo-400 uppercase tracking-widest">AI Intelligence</div>
          <NavLink to="/copilot" icon="✨" text="HemaSmart Copilot" />

          {/* 2. Overview Section */}
          <div className="mt-8 mb-3 px-5 text-[11px] font-black text-gray-600 uppercase tracking-widest">Overview</div>
          <NavLink to="/" icon="📊" text="Main Dashboard" />
          <NavLink to="/analytics" icon="📈" text="Data Analytics" />
          
          {/* 3. Donor CRM Section */}
          <div className="mt-8 mb-3 px-5 text-[11px] font-black text-gray-600 uppercase tracking-widest">Donor CRM</div>
          <NavLink to="/donors" icon="👥" text="Donor Directory" />
          <NavLink to="/recommend" icon="🩸" text="Smart Recommendation" />
          
          {/* 4. Clinical Section */}
          <div className="mt-8 mb-3 px-5 text-[11px] font-black text-gray-600 uppercase tracking-widest">Clinical</div>
          <NavLink to="/bot" icon="🤖" text="HemaBot Triage" />
          <NavLink to="/lab" icon="🔬" text="Lab Processing" />
          <NavLink to="/crossmatch" icon="🏥" text="Crossmatch & Issue" />

          {/* 5. Logistics Section */}
          <div className="mt-8 mb-3 px-5 text-[11px] font-black text-gray-600 uppercase tracking-widest">Logistics</div>
          <NavLink to="/predict" icon="🔮" text="Demand Prediction" />
          <NavLink to="/matrix" icon="🧊" text="Cold Storage Matrix" />
          <NavLink to="/optimize" icon="🚚" text="Storage Optimization" />
          <NavLink to="/route" icon="🗺️" text="Emergency Routing" />
          
          {/* 6. System Section */}
          <div className="mt-8 mb-3 px-5 text-[11px] font-black text-gray-600 uppercase tracking-widest">System & Security</div>
          <NavLink to="/logs" icon="🖥️" text="Audit Logs" />
        </ul>

        {/* User Profile Card */}
        <div className="mt-8 p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center font-black text-lg shadow-lg">
              DB
            </div>
            <div>
              <p className="text-base font-bold text-white">Daksh Bansal</p>
              <p className="text-xs text-green-400 font-bold tracking-wide mt-0.5">● System Admin</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area (Spacious Layout) */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/donors" element={<DonorDirectory />} />
            <Route path="/recommend" element={<DonorRecommend />} />
            <Route path="/predict" element={<DemandPredict />} />
            <Route path="/optimize" element={<Optimization />} />
            <Route path="/matrix" element={<InventoryMatrix />} />
            <Route path="/route" element={<BloodRouting />} />
            <Route path="/bot" element={<EligibilityChecker />} />
            <Route path="/lab" element={<LabProcessing />} />
            <Route path="/crossmatch" element={<CrossmatchIssue />} />
            <Route path="/logs" element={<AuditLogs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Router Wrapper
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;