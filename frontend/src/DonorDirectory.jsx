import { useState, useEffect } from 'react';

function DonorDirectory() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/donors')
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch donors", err);
        setLoading(false);
      });
  }, []);

  // Calculate if donor is eligible (90 days cooldown rule)
  const getEligibility = (lastDate) => {
    if (!lastDate) return { status: 'Eligible', color: 'bg-green-100 text-green-700 border-green-200' };
    
    const daysSince = Math.floor((new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24));
    if (daysSince >= 90) return { status: 'Eligible', color: 'bg-green-100 text-green-700 border-green-200' };
    
    return { 
      status: `Cooldown (${90 - daysSince} days left)`, 
      color: 'bg-orange-100 text-orange-700 border-orange-200' 
    };
  };

  // Search and Filter Logic
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          donor.contact.includes(searchTerm);
    const matchesGroup = filterGroup === 'All' || donor.blood_group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="max-w-7xl mx-auto pb-16 animate-fade-in-up">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Donor Directory</h2>
          <p className="text-lg text-gray-500 font-medium">Manage registered donors, track donation history, and verify eligibility.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl w-72 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all shadow-sm"
            />
          </div>
          <select 
            value={filterGroup} 
            onChange={(e) => setFilterGroup(e.target.value)}
            className="py-3 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 shadow-sm font-bold text-gray-700"
          >
            <option value="All">All Groups</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Donor Info</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Blood Group</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contact details</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">History</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400 font-medium">Syncing donor database...</td>
                </tr>
              ) : filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-400 font-medium border-2 border-dashed border-gray-100 m-4 rounded-xl">No donors found matching your search criteria.</td>
                </tr>
              ) : (
                filteredDonors.map((donor) => {
                  const eligibility = getEligibility(donor.last_donation);
                  
                  return (
                    <tr key={donor.donor_id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                            {donor.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{donor.name}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">ID: DON-{donor.donor_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="inline-flex w-12 h-12 items-center justify-center bg-red-50 text-red-600 rounded-xl font-black text-lg border border-red-100 group-hover:scale-110 transition-transform">
                          {donor.blood_group}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="font-medium text-gray-800">{donor.contact}</p>
                        <p className="text-xs text-gray-500 mt-0.5">City Code: {donor.city_id}</p>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-800">{donor.total_donations} Units</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Last: {donor.last_donation ? new Date(donor.last_donation).toLocaleDateString() : 'Never'}
                        </p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${eligibility.color}`}>
                          {eligibility.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-gray-400 hover:text-gray-900 p-2 transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DonorDirectory;