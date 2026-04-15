import { useState, useEffect } from 'react';

function InventoryMatrix() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default empty states so the matrix always looks full even without data
  const defaultMatrix = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => ({
    blood_group: bg,
    total_units: 0,
    nearest_expiry: null,
    status: 'critical'
  }));

  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then(res => res.json())
      .then(data => {
        // Merge real data with our default matrix layout
        const mergedData = defaultMatrix.map(def => {
          const found = data.find(d => d.blood_group === def.blood_group);
          if (found) {
            const units = parseInt(found.total_units);
            let status = 'safe';
            if (units < 5) status = 'critical';
            else if (units < 15) status = 'warning';
            
            return { ...found, status, total_units: units };
          }
          return def;
        });
        setInventory(mergedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch inventory", err);
        setInventory(defaultMatrix);
        setLoading(false);
      });
  }, []);

  const calculateDaysLeft = (dateString) => {
    if (!dateString) return null;
    const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cold Storage Matrix</h2>
        <p className="text-gray-500 mt-2 font-medium">Real-time telemetry of physical blood units currently preserved in the facility.</p>
      </div>

      <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800">
        
        {/* Matrix Header Controls */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Main Refrigerator Unit A-1</h3>
              <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Temp: 4.2°C • Humidity: 45%</p>
            </div>
          </div>
          
          {/* Status Legends */}
          <div className="hidden md:flex gap-4 bg-gray-800 p-2 rounded-xl">
            <span className="flex items-center gap-2 text-xs font-bold text-gray-300 px-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Critical (&lt;5)</span>
            <span className="flex items-center gap-2 text-xs font-bold text-gray-300 px-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> Low (5-15)</span>
            <span className="flex items-center gap-2 text-xs font-bold text-gray-300 px-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Optimal</span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-20 font-bold uppercase tracking-widest animate-pulse">Scanning Cold Storage...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {inventory.map((item, idx) => {
              const daysLeft = calculateDaysLeft(item.nearest_expiry);
              const isExpiringSoon = daysLeft !== null && daysLeft <= 5;

              return (
                <div key={idx} className="relative group perspective">
                  <div className={`p-6 rounded-2xl border transition-all duration-300 transform group-hover:scale-[1.02] ${
                    item.status === 'critical' ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/60' :
                    item.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/60' :
                    'bg-green-500/10 border-green-500/30 hover:border-green-500/60'
                  }`}>
                    
                    {/* Status Dot */}
                    <div className="absolute top-4 right-4">
                      <span className={`flex h-3 w-3 relative`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          item.status === 'critical' ? 'bg-red-400' : item.status === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${
                          item.status === 'critical' ? 'bg-red-500' : item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></span>
                      </span>
                    </div>

                    <h4 className={`text-4xl font-black mb-1 drop-shadow-md ${
                       item.status === 'critical' ? 'text-red-400' : item.status === 'warning' ? 'text-yellow-400' : 'text-green-400'
                    }`}>{item.blood_group}</h4>
                    
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Stock</p>
                        <p className="text-white text-3xl font-bold font-mono">{item.total_units} <span className="text-sm font-normal text-gray-500">U</span></p>
                      </div>
                    </div>

                    {/* Expiry Warning Widget */}
                    <div className="mt-5 h-14">
                      {item.total_units > 0 ? (
                        <div className={`p-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${
                          isExpiringSoon ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse' : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}>
                          <span className="text-lg">{isExpiringSoon ? '⚠️' : '⏳'}</span>
                          <div>
                            <p className="uppercase tracking-wide opacity-80">Earliest Expiry</p>
                            <p>{daysLeft} Days Remaining</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-gray-800/50 text-gray-600 text-xs font-bold border border-gray-800 uppercase tracking-widest text-center flex items-center justify-center h-full">
                          Empty Stock
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryMatrix;