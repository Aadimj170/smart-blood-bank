import { useState } from 'react';

function LabProcessing() {
  const [activeTab, setActiveTab] = useState('testing');

  // Mock data for bags that need testing
  const [pendingTests, setPendingTests] = useState([
    { bag_id: 'BAG-892', donor_name: 'Rahul Sharma', blood_group: 'O+', date: '2026-04-11', status: 'Pending' },
    { bag_id: 'BAG-893', donor_name: 'Amit Kumar', blood_group: 'A-', date: '2026-04-11', status: 'Pending' },
  ]);

  // Mock data for safe bags ready for component separation
  const [safeBags, setSafeBags] = useState([
    { bag_id: 'BAG-890', blood_group: 'B+', separated: false },
    { bag_id: 'BAG-891', blood_group: 'AB+', separated: false },
  ]);

  const handleTestResult = (bagId, isSafe) => {
    // In a real app, this sends a POST request to update DB status
    setPendingTests(pendingTests.filter(b => b.bag_id !== bagId));
    if (isSafe) {
      const bag = pendingTests.find(b => b.bag_id === bagId);
      setSafeBags([...safeBags, { ...bag, separated: false }]);
      alert(`${bagId} marked as SAFE. Sent for Component Separation.`);
    } else {
      alert(`${bagId} marked as REACTIVE. Biohazard protocol initiated. Bag discarded.`);
    }
  };

  const handleSeparate = (bagId) => {
    setSafeBags(safeBags.map(b => b.bag_id === bagId ? { ...b, separated: true } : b));
    alert(`${bagId} successfully fractionated into RBC, Plasma, and Platelets. Inventory updated.`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Lab Processing & Serology</h2>
        <p className="text-gray-600 mt-2">Manage TTIs (Transfusion Transmitted Infections) testing and blood component fractionation.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setActiveTab('testing')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'testing' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          🔬 Serology Testing
        </button>
        <button 
          onClick={() => setActiveTab('components')}
          className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'components' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          ⚙️ Component Fractionation
        </button>
      </div>

      {/* Tab 1: Serology Testing */}
      {activeTab === 'testing' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Pending Infections Screening
          </h3>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-bold text-gray-600">Bag ID</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Donor</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Blood Group</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Action (Result)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingTests.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">No pending tests.</td></tr>
                ) : (
                  pendingTests.map(bag => (
                    <tr key={bag.bag_id}>
                      <td className="p-4 font-mono font-bold text-gray-700">{bag.bag_id}</td>
                      <td className="p-4 text-gray-800">{bag.donor_name}</td>
                      <td className="p-4"><span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{bag.blood_group}</span></td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleTestResult(bag.bag_id, true)} className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded border border-green-300 transition-colors">
                          Pass (Safe)
                        </button>
                        <button onClick={() => handleTestResult(bag.bag_id, false)} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded border border-red-300 transition-colors">
                          Fail (Reactive)
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Component Separation */}
      {activeTab === 'components' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Whole Blood Fractionation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeBags.map(bag => (
              <div key={bag.bag_id} className={`p-5 rounded-lg border-2 transition-all ${bag.separated ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-mono font-bold text-gray-800 text-lg">{bag.bag_id}</h4>
                    <span className="font-bold text-red-600">{bag.blood_group} Whole Blood</span>
                  </div>
                  {bag.separated ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Processed</span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Ready for Centrifuge</span>
                  )}
                </div>
                
                {bag.separated ? (
                  <div className="space-y-2 mt-4 text-sm font-medium">
                    <div className="flex justify-between bg-red-50 p-2 rounded border border-red-100 text-red-800">
                      <span>Packed RBCs</span> <span>Exp: 35 Days</span>
                    </div>
                    <div className="flex justify-between bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800">
                      <span>Fresh Frozen Plasma</span> <span>Exp: 1 Year</span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-2 rounded border border-gray-200 text-gray-800">
                      <span>Platelets</span> <span>Exp: 5 Days</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleSeparate(bag.bag_id)}
                    className="w-full mt-2 bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-md transition-colors"
                  >
                    Run Centrifuge & Split
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LabProcessing;