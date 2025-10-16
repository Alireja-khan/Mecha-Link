"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Clock, Trash2, Menu, X, Send, Bot, User, Car } from "lucide-react";

export default function MechaLinkQnA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mechaHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = new Date().getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - parsed.timestamp < sevenDays) {
        setHistory(parsed.data);
      } else {
        localStorage.removeItem("mechaHistory");
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    localStorage.setItem(
      "mechaHistory",
      JSON.stringify({ data: newHistory, timestamp: new Date().getTime() })
    );
  };

  // Clear history function
  const clearHistory = () => {
    localStorage.removeItem("mechaHistory");
    setHistory([]);
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a car-related question.");
      return;
    }

    setError("");
    setAnswer("");
    setLoading(true);

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
              You are MechaLink AI, an expert car mechanic and vehicle systems assistant.
              Answer this user's question clearly and practically.
              Use simple language. Avoid generic or overly technical words.
              Question: "${question}"
              `,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API request failed");

      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        const cleanText = generatedText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        setAnswer(cleanText);

        const newHistory = [{ question, answer: cleanText }, ...history].slice(0, 10);
        setHistory(newHistory);
        saveHistory(newHistory);
        setQuestion("");
      } else {
        setError("No response received from MechaLink AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while getting the answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-20 w-80 bg-base-100 border-r border-base-300 h-screen transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow-xl`}
      >
        <div className="p-6 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Clock className="text-primary-content" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base-content">Chat History</h2>
                <p className="text-sm text-base-content/70">{history.length} conversations</p>
              </div>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="md:hidden p-2 hover:bg-base-300 rounded-lg transition-colors"
            >
              <X size={18} className="text-base-content" />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto h-[calc(100vh-120px)]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-base-content/30 mb-3" size={40} />
              <p className="text-base-content/60">No conversation history yet</p>
              <p className="text-base-content/40 text-sm mt-1">Your questions will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAnswer(item.answer);
                    if (window.innerWidth < 768) setShowSidebar(false);
                  }}
                  className="w-full text-left p-4 rounded-xl border border-base-300 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-base-content line-clamp-2 group-hover:text-primary transition-colors">
                        {item.question}
                      </p>
                      <p className="text-xs text-base-content/60 mt-1">
                        {item.answer.substring(0, 40)}...
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-base-300">
            <button
              onClick={clearHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error/10 text-error border border-error/20 rounded-xl hover:bg-error/20 transition-colors font-medium"
            >
              <Trash2 size={16} />
              Clear All History
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-base-100 border-b border-base-300 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Car className="text-primary-content" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-base-content">MechaLink AI</h1>
              <p className="text-xs text-base-content/70">Car Expert Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 hover:bg-base-300 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-base-content" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-6">
          {/* Welcome Header */}
          <div className="text-center mb-8 md:mb-12 mt-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bot className="text-primary-content" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-3">
              MechaLink AI Assistant
            </h1>
            <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
              Ask anything about car repair, maintenance, or mechanical systems. 
              Get expert answers instantly.
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col">
            {/* Answer Display */}
            {answer && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bot className="text-primary-content" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-semibold text-base-content">MechaLink AI</h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Expert</span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-base-content leading-relaxed whitespace-pre-line">
                          {answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-error/10 border border-error/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-error rounded-lg flex items-center justify-center flex-shrink-0">
                      <X className="text-error-content" size={16} />
                    </div>
                    <p className="text-error text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-lg p-6 sticky bottom-6">
              <div className="flex flex-col gap-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask something like: Why does my engine make a ticking sound? or How to fix low brake pressure?"
                  rows={3}
                  className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none text-base-content placeholder-base-content/50 transition-all duration-200"
                  disabled={loading}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <MessageSquare size={14} />
                    <span>{history.length} past conversations</span>
                  </div>
                  <button
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-primary/90 disabled:bg-base-300 disabled:text-base-content/50 transition-all duration-200 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                        Getting Answer...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Get Answer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}