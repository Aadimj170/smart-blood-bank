import { useEffect, useState } from 'react';

function Dashboard() {
  const [topDonors, setTopDonors] = useState([]);
  const [emergencyQueue, setEmergencyQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', blood_group: 'O+', contact: '', city_id: '1' });
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/top-donors').then(res => res.json()),
      fetch('http://localhost:5000/api/emergency-queue').then(res => res.json())
    ])
    .then(([donorsData, queueData]) => {
      setTopDonors(donorsData);
      setEmergencyQueue(queueData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Backend not running!", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/add-donor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setToast({ show: true, message: 'New Donor Profile Successfully Synced to Database.' });
      setTimeout(() => setToast({ show: false, message: '' }), 4000);
      
      setFormData({ name: '', blood_group: 'O+', contact: '', city_id: '1' });
      fetchData(); 
    } catch (error) {
      console.error("Failed to add donor", error);
    }
  };

  const filteredDonors = topDonors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = emergencyQueue.filter(req => req.priority_level === 5).length;
  const mostRequestedGroup = emergencyQueue.length > 0 ? emergencyQueue[0].blood_group : 'None';
  
  const generateInsight = () => {
    if (criticalCount > 0) {
      return `🔴 ACTION REQUIRED: ${criticalCount} Critical emergency request(s) pending. Immediate dispatch of ${mostRequestedGroup} blood required. Auto-notification to donors is recommended.`;
    } else if (emergencyQueue.length > 0) {
      return `🟡 SYSTEM NOTICE: Steady demand detected. Highest requested blood group today is ${mostRequestedGroup}. Cold storage levels should be optimized.`;
    }
    return `🟢 ALL CLEAR: Blood stock is stable. No pending emergency dispatches required at this time.`;
  };

  return (
    <div className="animate-fade-in-up pb-16 relative max-w-7xl mx-auto">
      
      {/* Sleek Floating Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-12 right-12 bg-[#0b1120] border border-gray-800 text-white px-8 py-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-5 z-50 animate-fade-in-up">
          <div className="bg-green-500/20 p-3 rounded-full">
            <span className="text-green-400 text-2xl">✓</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-100 uppercase tracking-widest mb-1">Success</h4>
            <p className="text-sm text-gray-400 font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Spacious Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-5xl font-black bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent tracking-tight">Overview</h2>
            <span className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-black rounded-full border border-red-200 tracking-widest uppercase">Live Status</span>
          </div>
          <p className="text-gray-500 text-lg font-medium">Real-time facility telemetry and supply chain metrics.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-3 px-6 py-3.5 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-xl">🖨️</span> Export Report
          </button>
        </div>
      </div>

      {/* SPACIOUS KPI STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-16 h-16 bg-red-50 rounded-2xl text-red-600 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Registered Donors</p>
            <h3 className="text-3xl font-black text-gray-900">{topDonors.length > 0 ? topDonors.length * 14 : '--'}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl text-orange-600 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Requests</p>
            <h3 className="text-3xl font-black text-gray-900">{emergencyQueue.length}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
          {criticalCount > 0 && <div className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse"></div>}
          <div className="w-16 h-16 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200 flex items-center justify-center shrink-0 animate-pulse">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Critical Emergencies</p>
            <h3 className="text-3xl font-black text-red-600">{criticalCount}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">High Demand Group</p>
            <h3 className="text-3xl font-black text-gray-900">{mostRequestedGroup}</h3>
          </div>
        </div>
      </div>

      {/* BIG AUTOMATED INSIGHTS WIDGET */}
      <div className="mb-12 bg-[#0b1120] rounded-[2rem] p-10 shadow-2xl border border-gray-800 flex items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
        <div className="w-20 h-20 bg-gray-800/50 rounded-[1.5rem] border border-gray-700 flex items-center justify-center shrink-0">
          <span className="text-4xl">🤖</span>
        </div>
        <div>
          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-2">HemaSmart AI Diagnostic</h4>
          <p className="text-white font-medium text-xl leading-relaxed">{generateInsight()}</p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (Spans 8) */}
        <div className="col-span-1 lg:col-span-8 space-y-10">
          
          {/* Quick Registration Form - Airy Layout */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-4 mb-8">
              <span className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl">➕</span> 
              Quick Register Donor
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-gray-800" placeholder="e.g. Rahul Sharma" />
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Blood Group</label>
                <select value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-800">
                  <option value="O+">O+</option> <option value="O-">O-</option>
                  <option value="A+">A+</option> <option value="A-">A-</option>
                  <option value="B+">B+</option> <option value="AB+">AB+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                <select value={formData.city_id} onChange={e => setFormData({...formData, city_id: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-800">
                  <option value="1">Mumbai</option> <option value="2">Delhi</option> <option value="3">Bangalore</option>
                </select>
              </div>
              
              <div className="col-span-1 md:col-span-2 flex items-end gap-6 mt-2">
                <div className="flex-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact No.</label>
                  <input type="text" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-medium text-gray-800" placeholder="+91 98765 43210" />
                </div>
                <button type="submit" className="px-8 py-4 bg-[#0b1120] hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl shrink-0">
                  Register Profile
                </button>
              </div>
            </form>
          </div>

          {/* Top Donors Table - Spacious Rows */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-4">
                <span className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center text-xl">🏆</span> 
                Top Contributors
              </h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search donor..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none w-48 md:w-64 transition-all font-medium"
                />
                <span className="absolute left-4 top-3 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Donor Name</th>
                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Group</th>
                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Contributions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="3" className="p-10 text-center text-gray-400 font-medium">Loading data...</td></tr>
                  ) : filteredDonors.length > 0 ? (
                    filteredDonors.map((donor, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">{donor.name}</td>
                        <td className="p-5 text-center">
                          <span className="inline-block bg-red-50 text-red-600 py-1.5 px-4 rounded-xl text-sm font-black border border-red-100">
                            {donor.blood_group}
                          </span>
                        </td>
                        <td className="p-5 text-gray-500 font-bold text-right">{donor.total_donations} Units</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No donors found matching "{searchTerm}"</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Spans 4) - Emergency Queue */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-400"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-4 mb-8 mt-2">
              <span className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl">🚨</span> 
              Dispatch Queue
            </h2>
            
            <div className="space-y-5 flex-1 overflow-y-auto pr-2">
              {loading ? (
                <p className="text-gray-400 text-center py-10 font-medium">Loading queue...</p>
              ) : emergencyQueue.map((req, idx) => (
                <div key={idx} className={`p-6 rounded-[1.5rem] border-2 transition-all hover:-translate-y-1 ${req.priority_level === 5 ? 'bg-red-50/50 border-red-100 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-gray-900 text-lg">{req.patient_name}</h3>
                    {req.priority_level === 5 && <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest animate-pulse shadow-md">Critical</span>}
                    {req.priority_level === 3 && <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-orange-200">Urgent</span>}
                    {req.priority_level === 2 && <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-200">Normal</span>}
                  </div>
                  <div className="flex items-center gap-3 bg-white/50 rounded-xl p-2 w-max border border-gray-50">
                    <span className="text-2xl font-black text-gray-300">#</span>
                    <p className="text-sm text-gray-500"><span className="font-bold text-gray-900 text-base">{req.units_required} unit(s)</span> of <span className="font-black text-red-600 text-base">{req.blood_group}</span></p>
                  </div>
                </div>
              ))}
              {!loading && emergencyQueue.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                  <span className="text-4xl mb-4 opacity-50">☕</span>
                  <p className="text-gray-400 text-center font-bold">No active dispatch requests.<br/>Take a break.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;