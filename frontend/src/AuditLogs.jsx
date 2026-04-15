import { useState, useEffect } from 'react';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-refresh logs every 5 seconds
  useEffect(() => {
    const fetchLogs = () => {
      fetch('http://localhost:5000/api/system-logs')
        .then(res => res.json())
        .then(data => {
          setLogs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch logs", err);
          setLoading(false);
        });
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const getActionColor = (action) => {
    if (action.includes('ERROR') || action.includes('CRITICAL')) return 'text-red-500';
    if (action.includes('REGISTER') || action.includes('SAFE')) return 'text-green-500';
    if (action.includes('DISPATCH') || action.includes('ROUTE')) return 'text-blue-500';
    if (action.includes('SYSTEM')) return 'text-purple-500';
    return 'text-yellow-500';
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Audit Trail</h2>
          <p className="text-gray-500 mt-2 font-medium">Real-time immutable security and operational event logs.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-mono text-sm shadow-md">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          SECURE CONNECTION
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col h-[600px]">
        {/* Terminal Header */}
        <div className="bg-[#1e293b] p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">HemaSmart Terminal /var/log/syslog</span>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm overflow-y-auto flex-1 bg-[#0f172a]">
          {loading ? (
            <div className="text-green-500 animate-pulse flex items-center gap-2">
              <span>_</span> Initializing log stream...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-gray-500 italic">No events recorded in current session. Awaiting system activity...</div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="group hover:bg-[#1e293b] p-2 -mx-2 rounded transition-colors flex gap-4 break-words">
                  <div className="text-gray-500 whitespace-nowrap opacity-60 group-hover:opacity-100">
                    [{formatDate(log.timestamp)}]
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-400 mr-2">{log.user}@system:~$</span>
                    <span className={`${getActionColor(log.action)} font-bold mr-2`}>
                      {log.action}
                    </span>
                    <span className="text-gray-300">
                      {log.details}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Terminal Footer Indicator */}
        <div className="bg-[#1e293b] p-2 text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest border-t border-gray-800">
          End of Log Stream
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;