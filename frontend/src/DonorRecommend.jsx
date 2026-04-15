import { useState } from 'react';

function DonorRecommend() {
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [cityId, setCityId] = useState('1'); 
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recommend-donors?blood_group=${encodeURIComponent(bloodGroup)}&city_id=${cityId}`);
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Smart Recommendation</h2>
        <p className="text-gray-500 mt-2 font-medium">AI-driven donor eligibility and routing system based on 90-day cooldown rules.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer font-bold text-gray-700">
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search Region (City)</label>
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer font-bold text-gray-700">
              <option value="1">Mumbai</option>
              <option value="2">Delhi</option>
              <option value="3">Bangalore</option>
            </select>
          </div>
          <button onClick={fetchRecommendations} className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <span>🔍</span> Run Search Algorithm
          </button>
        </div>
      </div>

      {searched && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="p-2 bg-green-50 text-green-600 rounded-xl">✓</span> Eligible Donors Found
          </h3>
          
          {loading ? (
            <p className="text-center text-gray-500 py-10 font-medium animate-pulse">Querying Database...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-xl">Donor Name</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Days Since Last Donation</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-xl">System Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donors.length > 0 ? (
                    donors.map((donor, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-800">{donor.name}</td>
                        <td className="p-4 text-gray-600 font-medium">{donor.contact || 'N/A'}</td>
                        <td className="p-4 text-gray-600 font-medium">
                          {donor.days_since_last === null ? 'Never Donated' : `${donor.days_since_last} days`}
                        </td>
                        <td className="p-4">
                          <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wide">
                            Eligible
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center">
                        <div className="inline-block p-4 bg-red-50 rounded-full mb-3 text-2xl">⚠️</div>
                        <h4 className="text-gray-800 font-bold mb-1">No Matches Found</h4>
                        <p className="text-gray-500 text-sm">No eligible donors found for this specific blood group in this region. The 90-day cooldown filter is active.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DonorRecommend;