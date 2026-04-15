import { useState, useRef, useEffect } from 'react';

function Copilot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Welcome to HemaSmart AI. I am your generative assistant. You can ask me to analyze inventory, check for emergencies, or summarize data.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Naya message aane par auto-scroll karne ke liye
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fake AI Logic (Simulating a real LLM like Gemini)
  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    
    setTimeout(() => {
      let aiResponse = "";

      if (text.includes("inventory") || text.includes("stock")) {
        aiResponse = "📊 **Live Inventory Scan Complete:**\n\n- **O+**: 12 Units (Safe)\n- **A-**: 3 Units (CRITICAL - Expires in 2 days)\n- **B+**: 8 Units (Safe)\n\n*Action:* Initiate donor drive for A- blood.";
      } 
      else if (text.includes("emergency") || text.includes("urgent")) {
        aiResponse = "🚨 **Active Dispatch Queue:**\n\n1. **Anjali Desai** (Requires 4 Units A-) - CRITICAL\n2. **Rohan Mehta** (Requires 1 Unit B+) - URGENT";
      }
      else {
        aiResponse = "I'm analyzing your request. As a simulated AI, I am optimized for queries about 'inventory' or 'emergencies'. Try asking: *'What is the current stock?'*";
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500); // 1.5 seconds typing animation delay
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    generateAIResponse(input);
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block mb-1">
          {parts.map((part, j) => 
            j % 2 === 1 ? <strong key={j} className="text-white font-bold">{part}</strong> : part
          )}
        </span>
      );
    });
  };

  return (
    <div className="h-[85vh] flex flex-col bg-[#0b1120] rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#111827] px-8 py-5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">✨</div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">HemaSmart Copilot</h2>
            <p className="text-xs text-indigo-400 font-medium">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-2xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${msg.sender === 'user' ? 'bg-gray-700' : 'bg-indigo-600'}`}>
                {msg.sender === 'user' ? 'DB' : '🤖'}
              </div>
              <div className={`p-5 rounded-2xl ${msg.sender === 'user' ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-transparent text-gray-300'}`}>
                <div className="leading-relaxed font-medium">{formatText(msg.text)}</div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Animation */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-2xl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-lg">🤖</div>
              <div className="p-5 flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-6 bg-[#111827] border-t border-gray-800">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask HemaSmart to analyze data..." 
            className="w-full bg-[#1f2937] text-white p-5 pr-16 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700 font-medium"
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="absolute right-3 top-3 bottom-3 bg-indigo-600 hover:bg-indigo-500 text-white w-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Copilot;