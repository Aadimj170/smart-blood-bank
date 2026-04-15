import { useState, useEffect } from 'react';

function DemandPredict() {
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/demand-prediction')
      .then(res => res.json())
      .then(data => {
        setDemandData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch demand data", err);
        setLoading(false);
      });
  }, []);

  const maxDemand = demandData.length > 0 
    ? Math.max(...demandData.map(d => parseInt(d.total_demand) || 0)) 
    : 1;

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Demand Prediction</h2>
        <p className="text-gray-500 mt-2 font-medium">Monthly aggregation of active hospital requests to forecast critical blood group shortages.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl">📈</span>
          <h3 className="text-xl font-bold text-gray-800">Live Demand Analytics</h3>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <span className="relative flex h-5 w-5 mx-auto mb-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500"></span>
            </span>
            <p className="text-gray-500 font-medium animate-pulse">Aggregating hospital network data...</p>
          </div>
        ) : demandData.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No blood requests recorded for the current month.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {demandData.map((item, index) => {
              const demandValue = parseInt(item.total_demand) || 0;
              const widthPercentage = maxDemand > 0 ? (demandValue / maxDemand) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center group">
                  <div className="w-16 font-black text-lg text-gray-700 text-right pr-4">
                    {item.blood_group}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000 ease-out group-hover:from-red-500 group-hover:to-red-300"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                    <span className="absolute inset-y-0 left-4 flex items-center text-white font-bold text-sm drop-shadow-md tracking-wider">
                      {demandValue} UNITS REQ.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Automated Insight Component */}
      {!loading && demandData.length > 0 && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700 flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 mt-1">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">Predictive Insight Active</h4>
            <p className="text-gray-300 font-medium leading-relaxed">
              Based on the aggregated telemetry, <span className="font-black text-white px-2 py-0.5 bg-gray-700 rounded">{demandData[0].blood_group}</span> is currently experiencing the highest deficit. To mitigate potential stockouts, the system recommends triggering targeted acquisition protocols for <span className="text-white font-bold">{demandData[0].blood_group}</span> donors within the next 48 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemandPredict;