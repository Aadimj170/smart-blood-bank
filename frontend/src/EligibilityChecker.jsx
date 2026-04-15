import { useState } from 'react';

function EligibilityChecker() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ age: '', weight: '', lastDonation: '', tattoo: null });
  const [result, setResult] = useState(null);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const calculateEligibility = () => {
    // Smart Rule Engine
    let isEligible = true;
    let reasons = [];

    if (answers.age < 18 || answers.age > 65) {
      isEligible = false;
      reasons.push("Age must be between 18 and 65 years.");
    }
    if (answers.weight < 50) {
      isEligible = false;
      reasons.push("Body weight must be at least 50 kg.");
    }
    if (answers.tattoo === 'yes') {
      isEligible = false;
      reasons.push("Cannot donate if you had a tattoo or piercing in the last 6 months.");
    }
    if (answers.lastDonation) {
      const daysSince = Math.floor((new Date() - new Date(answers.lastDonation)) / (1000 * 60 * 60 * 24));
      if (daysSince < 90) {
        isEligible = false;
        reasons.push(`You donated ${daysSince} days ago. A 90-day cooldown is mandatory.`);
      }
    }

    setResult({ isEligible, reasons });
    setStep(5); // Move to result screen
  };

  const resetBot = () => {
    setStep(1);
    setAnswers({ age: '', weight: '', lastDonation: '', tattoo: null });
    setResult(null);
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">HemaBot Assistant</h2>
        <p className="text-gray-500 mt-2 font-medium">Interactive automated triage to determine donor eligibility instantly.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px] flex flex-col">
        {/* Chatbot Header */}
        <div className="bg-gray-900 p-6 flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">🤖</div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">HemaBot Evaluation</h3>
            <p className="text-gray-400 text-sm font-medium">Step {Math.min(step, 4)} of 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-800">
          <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}></div>
        </div>

        {/* Interactive Workspace */}
        <div className="p-10 flex-1 flex flex-col justify-center bg-gray-50/50">
          
          {step === 1 && (
            <div className="animate-fade-in-up max-w-md mx-auto w-full">
              <label className="block text-lg font-bold text-gray-800 mb-4 text-center">What is the donor's current age?</label>
              <input type="number" value={answers.age} onChange={e => setAnswers({...answers, age: e.target.value})} className="w-full text-center text-3xl font-black p-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all shadow-sm" placeholder="e.g. 25" autoFocus />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up max-w-md mx-auto w-full">
              <label className="block text-lg font-bold text-gray-800 mb-4 text-center">What is the donor's weight (in Kg)?</label>
              <input type="number" value={answers.weight} onChange={e => setAnswers({...answers, weight: e.target.value})} className="w-full text-center text-3xl font-black p-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all shadow-sm" placeholder="e.g. 65" autoFocus />
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up max-w-md mx-auto w-full">
              <label className="block text-lg font-bold text-gray-800 mb-4 text-center">Date of last blood donation?</label>
              <p className="text-center text-gray-500 mb-4 text-sm">Leave blank if this is their first time donating.</p>
              <input type="date" value={answers.lastDonation} onChange={e => setAnswers({...answers, lastDonation: e.target.value})} className="w-full text-center text-xl font-bold p-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-red-500 outline-none transition-all shadow-sm" />
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up max-w-md mx-auto w-full">
              <label className="block text-lg font-bold text-gray-800 mb-6 text-center">Any tattoos or piercings in the last 6 months?</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setAnswers({...answers, tattoo: 'yes'})} className={`p-4 rounded-2xl font-bold text-lg border-2 transition-all ${answers.tattoo === 'yes' ? 'bg-red-50 border-red-500 text-red-700 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'}`}>Yes</button>
                <button onClick={() => setAnswers({...answers, tattoo: 'no'})} className={`p-4 rounded-2xl font-bold text-lg border-2 transition-all ${answers.tattoo === 'no' ? 'bg-green-50 border-green-500 text-green-700 shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'}`}>No</button>
              </div>
            </div>
          )}

          {step === 5 && result && (
            <div className="animate-fade-in-up text-center">
              {result.isEligible ? (
                <div>
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 shadow-inner border border-green-200">
                    <span className="text-5xl text-green-600">✓</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">Donor is Eligible!</h3>
                  <p className="text-gray-500 text-lg mb-8">All parameters meet the national blood donation guidelines.</p>
                  <button onClick={resetBot} className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">Start New Triage</button>
                </div>
              ) : (
                <div>
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 shadow-inner border border-red-200">
                    <span className="text-5xl text-red-600">✗</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">Not Eligible to Donate</h3>
                  <div className="bg-red-50 text-red-700 p-6 rounded-2xl inline-block text-left border border-red-100 mb-8 max-w-md w-full">
                    <ul className="list-disc pl-5 space-y-2 font-medium">
                      {result.reasons.map((reason, idx) => <li key={idx}>{reason}</li>)}
                    </ul>
                  </div>
                  <br />
                  <button onClick={resetBot} className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all">Evaluate Another Donor</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        {step < 5 && (
          <div className="bg-white border-t border-gray-100 p-6 flex justify-between">
            <button onClick={handlePrev} disabled={step === 1} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-all">← Back</button>
            {step < 4 ? (
              <button onClick={handleNext} disabled={(step === 1 && !answers.age) || (step === 2 && !answers.weight)} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-all">Continue →</button>
            ) : (
              <button onClick={calculateEligibility} disabled={answers.tattoo === null} className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all">Analyze Results ✨</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EligibilityChecker;