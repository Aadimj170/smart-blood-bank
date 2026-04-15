import { useState } from 'react';

function BloodRouting() {
  const [source, setSource] = useState('Mumbai');
  const [destination, setDestination] = useState('Pune');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const cities = ['Mumbai', 'Pune', 'Nashik', 'Surat', 'Satara', 'Aurangabad', 'Kolhapur', 'Ahmedabad'];

  const handleCalculate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/shortest-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to calculate route", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Emergency Routing</h2>
        <p className="text-gray-600 mt-2">Dijkstra's Algorithm module for finding the shortest transport path between regional blood banks.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dispatch Source (Available Bank)</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none">
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none">
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleCalculate} 
          disabled={source === destination || loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? 'Calculating...' : 'Find Shortest Route'}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Calculated Transport Route</h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl">📍</span>
              <p className="text-xl font-bold text-gray-700">{result.path}</p>
            </div>
            <div className="inline-block px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-bold">
              Total Distance: {result.totalDistance} km
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BloodRouting;