import { useState } from 'react';

function CrossmatchIssue() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedBag, setSelectedBag] = useState(null);

  // Mock Active Requests from Emergency Queue
  const pendingRequests = [
    { id: 'REQ-101', name: 'Anjali Desai', group: 'A-', units: 4, urgency: 'Critical' },
    { id: 'REQ-102', name: 'Rohan Mehta', group: 'B+', units: 1, urgency: 'Urgent' },
  ];

  // Compatibility Engine Logic
  const compatibilityChart = {
    'O-': ['O-'],
    'O+': ['O+', 'O-'],
    'A-': ['A-', 'O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'] // Universal Recipient
  };

  // Mock Available Bags in Fridge
  const availableBags = [
    { bagId: 'BAG-771', group: 'A-', expiry: '12 Days', type: 'Packed RBC' },
    { bagId: 'BAG-772', group: 'O-', expiry: '5 Days', type: 'Packed RBC' },
    { bagId: 'BAG-773', group: 'B+', expiry: '20 Days', type: 'Whole Blood' },
  ];

  const handleCrossmatch = (bag) => {
    setSelectedBag(bag);
    setStep(3);
  };

  const handleIssueBlood = () => {
    alert(`✅ SUCCESS: ${selectedBag.bagId} has been successfully crossmatched and ISSUED for patient ${selectedPatient.name}. Inventory Updated.`);
    setSelectedPatient(null);
    setSelectedBag(null);
    setStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 animate-fade-in-up">
      {/* Spacious Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Clinical Crossmatch & Issue</h2>
        <p className="text-lg text-gray-500 font-medium">Evaluate patient compatibility and securely dispatch blood components.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Patient Selection (Spacious Cards) */}
        <div className="lg:col-span-5 space-y-8">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">1</span>
            Select Patient
          </h3>
          
          <div className="space-y-6">
            {pendingRequests.map(req => (
              <div 
                key={req.id} 
                onClick={() => { setSelectedPatient(req); setStep(2); setSelectedBag(null); }}
                className={`p-8 rounded-3xl cursor-pointer transition-all duration-300 ${
                  selectedPatient?.id === req.id 
                  ? 'bg-gray-900 shadow-2xl scale-105 border-transparent' 
                  : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPatient?.id === req.id ? 'text-gray-400' : 'text-gray-400'}`}>
                    {req.id}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    req.urgency === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {req.urgency}
                  </span>
                </div>
                <h4 className={`text-2xl font-black mb-2 ${selectedPatient?.id === req.id ? 'text-white' : 'text-gray-900'}`}>
                  {req.name}
                </h4>
                <p className={`text-lg font-medium flex items-center gap-2 ${selectedPatient?.id === req.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  Needs <span className={`font-black ${selectedPatient?.id === req.id ? 'text-red-400' : 'text-red-600'}`}>{req.group}</span> ({req.units} Units)
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Compatibility & Issue */}
        <div className="lg:col-span-7">
          {step >= 2 && selectedPatient && (
            <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 animate-fade-in-up">
              
              <div className="mb-10 pb-8 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">2</span>
                  Compatibility Matrix
                </h3>
                <div className="flex items-center gap-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                  <div className="text-center">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Patient Group</p>
                    <div className="text-4xl font-black text-blue-700">{selectedPatient.group}</div>
                  </div>
                  <div className="text-blue-300 text-3xl">→</div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Safe to Receive</p>
                    <div className="flex gap-3 flex-wrap">
                      {compatibilityChart[selectedPatient.group].map(bg => (
                        <span key={bg} className="px-4 py-2 bg-white text-blue-700 font-black rounded-xl shadow-sm border border-blue-100">
                          {bg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {step === 2 && (
                <div className="animate-fade-in-up">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Select Bag from Cold Storage</h3>
                  <div className="space-y-4">
                    {availableBags
                      .filter(bag => compatibilityChart[selectedPatient.group].includes(bag.group))
                      .map(bag => (
                        <div key={bag.bagId} className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-black">
                              {bag.group}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{bag.bagId}</h4>
                              <p className="text-sm font-medium text-gray-500">{bag.type} • Expires in {bag.expiry}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleCrossmatch(bag)}
                            className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                          >
                            Run Crossmatch
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && selectedBag && (
                <div className="animate-fade-in-up bg-gray-900 p-10 rounded-[2rem] text-white text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">🔬</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3">Crossmatch Successful</h3>
                  <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                    Bag <span className="text-white font-bold">{selectedBag.bagId}</span> ({selectedBag.group}) has been clinically matched with <span className="text-white font-bold">{selectedPatient.name}</span>. No agglutination detected.
                  </p>
                  <button 
                    onClick={handleIssueBlood}
                    className="w-full py-5 bg-green-500 hover:bg-green-400 text-gray-900 text-xl font-black rounded-2xl transition-all shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                  >
                    AUTHORIZE & ISSUE BLOOD
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Empty State */}
          {step === 1 && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-6">👆</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Awaiting Selection</h3>
              <p className="text-gray-400 font-medium">Select a patient from the active queue to initiate the compatibility and crossmatching protocol.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CrossmatchIssue;