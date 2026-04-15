import { useState } from 'react';

function Optimization() {
  const [vehicleCapacity, setVehicleCapacity] = useState(10);
  const [result, setResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const [bloodUnits] = useState([
    { id: 1, blood_group: 'O+', units: 4, days_to_expiry: 2 },
    { id: 2, blood_group: 'A-', units: 5, days_to_expiry: 10 },
    { id: 3, blood_group: 'B+', units: 3, days_to_expiry: 1 },
    { id: 4, blood_group: 'AB+', units: 2, days_to_expiry: 5 },
    { id: 5, blood_group: 'O-', units: 6, days_to_expiry: 20 },
  ]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setResult(null);
    
    // Simulating a slight delay to make the "algorithm running" feel real
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/optimize-transport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            vehicleCapacity: parseInt(vehicleCapacity), 
            bloodUnits 
          })
        });
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error("Optimization failed", error);
      }
      setIsOptimizing(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Storage Optimization</h2>
        <p className="text-gray-500 mt-2 font-medium">Dynamic Programming (0/1 Knapsack) module to maximize transported blood utility before expiration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Pending Batches */}
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="p-2 bg-gray-100 text-gray-600 rounded-xl">📦</span>
            <h3 className="text-xl font-bold text-gray-800">Pending Blood Batches</h3>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Group</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Weight (Units)</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Expiration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bloodUnits.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-500">#{batch.id}</td>
                    <td className="p-4"><span className="font-black text-red-600">{batch.blood_group}</span></td>
                    <td className="p-4 font-bold text-gray-800">{batch.units}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-lg font-bold tracking-wide ${batch.days_to_expiry <= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {batch.days_to_expiry} Days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Algorithm Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-800 text-white">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <span className="text-red-500">⚙️</span> Optimization Parameters
            </h3>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Vehicle Capacity Constraints
              </label>
              <input 
                type="number" 
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 text-white font-bold outline-none"
                min="1"
              />
            </div>

            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isOptimizing ? 'Calculating DP Matrix...' : 'Run Knapsack Algorithm'}
            </button>
          </div>

          {/* Results Area */}
          {result && (
            <div className="animate-fade-in-up bg-white p-8 rounded-3xl shadow-md border-2 border-green-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-8xl">✓</span>
              </div>
              <h4 className="text-green-600 font-black text-lg mb-1 tracking-tight">Optimization Complete</h4>
              <p className="text-gray-500 font-medium text-sm mb-4">{result.message}</p>
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Max Utility Score</span>
                <span className="text-5xl font-black text-gray-900">{result.maxUtility}</span>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Optimization;