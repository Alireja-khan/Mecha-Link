"use client";
import { useState, useEffect } from "react";

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

        // Update history
        const newHistory = [{ question, answer: cleanText }, ...history].slice(
          0,
          10
        );
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

  const primaryColor = "bg-primary";
  const primaryText = "text-primary";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`min-h-screen bg-gray-500 md:bg-transparent border-r p-5 md:w-1/4 md:block absolute md:static z-10 h-full transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="text-xl font-semibold text-gray-900">📜 History</h3>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-900 font-bold px-2"
          >
            Close
          </button>
        </div>
        <h3 className="hidden md:block text-xl font-semibold mb-4 text-primary">
          📜 History
        </h3>
        {history.length === 0 && (
          <p className="text-gray-500">No history yet</p>
        )}
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li key={index}>
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 hover:text-black transition"
                onClick={() => {
                  setAnswer(item.answer);
                  if (window.innerWidth < 768) setShowSidebar(false); // close on mobile
                }}
              >
                {item.question.length > 50
                  ? item.question.slice(0, 50) + "..."
                  : item.question}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile toggle button */}
      <div className="md:hidden p-3 bg-gray-100 border-b flex justify-between items-center">
        <span className="font-semibold text-gray-700">MechaLink Q&A</span>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-700 font-bold"
        >
          {showSidebar ? "Close" : "History"}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-0">
        <header className="mb-6">
          <h1 className={`text-3xl font-bold ${primaryText} mb-2`}>
            🧠 MechaLink Q&A Assistant
          </h1>
          <p className="text-gray-400">
            Ask anything about car repair, maintenance, or mechanical systems.
          </p>
        </header>

        <div className="mb-6 border rounded-lg p-5 shadow-sm">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something like: Why does my engine make a ticking sound? or How to fix low brake pressure?"
            rows={4}
            className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-gray-400"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAsk}
              disabled={loading}
              className={`${primaryColor} hover:opacity-90 text-white font-bold px-6 py-3 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? "Getting Answer..." : "Get Answer"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {answer && (
          <div className="bg-white border rounded-lg shadow-sm p-5">
            <h2 className={`text-xl font-semibold ${primaryText} mb-2`}>
              🧠 Answer:
            </h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
