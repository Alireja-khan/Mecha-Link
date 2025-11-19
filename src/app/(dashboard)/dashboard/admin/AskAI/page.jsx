"use client"

import { useState, useEffect, useMemo, useRef } from "react";
import { Clock, Trash2, Menu, X, Send, Bot, User, Wrench, MessageSquare, Plus, Car, MoreVertical } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const generateChatTitle = (question) => {
  return question.length > 30 ? question.substring(0, 30) + "..." : question;
};

export default function MechaLinkQnA() {
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef(null);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const currentChat = useMemo(() => {
    return chats.find(chat => chat.id === currentChatId);
  }, [chats, currentChatId]);

  const messages = currentChat?.messages || [];

  const isClearButtonVisible = useMemo(() => {
    const hasAnyMessages = chats.some(chat => chat.messages.length > 0);
    return chats.length > 1 || hasAnyMessages;
  }, [chats]);

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSidebar]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    const stored = localStorage.getItem("mechaChats");
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = new Date().getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (now - parsed.timestamp < sevenDays && parsed.data.length > 0) {
        setChats(parsed.data);
        setCurrentChatId(parsed.data[0].id);
      } else {
        localStorage.removeItem("mechaChats");
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  const saveChats = (newChats) => {
    localStorage.setItem(
      "mechaChats",
      JSON.stringify({ data: newChats, timestamp: new Date().getTime() })
    );
  };

  const createNewChat = () => {
    if (currentChat && currentChat.messages.length === 0) {
      setCurrentChatId(currentChat.id);
      setError("");
      setQuestion("");
      return;
    }

    const newChat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      timestamp: new Date().getTime(),
    };

    setChats(prevChats => {
      const updatedChats = [newChat, ...prevChats];
      saveChats(updatedChats);
      return updatedChats;
    });

    setCurrentChatId(newChat.id);
    setError("");
    setQuestion("");
  };

  const clearAllChats = () => {
    localStorage.removeItem("mechaChats");
    setChats([]);
    createNewChat();
  };

  const selectChat = (chatId) => {
    setCurrentChatId(chatId);
    setShowSidebar(false);
    setError("");
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a car-related question.");
      return;
    }

    if (!currentChatId) return;

    setError("");
    setLoading(true);
    const userMessage = question.trim();
    setQuestion("");

    const newUserMessage = { role: "user", text: userMessage };

    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(c => c.id === currentChatId);
      if (chatIndex === -1) return prevChats;

      const updatedMessages = [...prevChats[chatIndex].messages, newUserMessage];
      const newTitle = prevChats[chatIndex].messages.length === 0
        ? generateChatTitle(userMessage)
        : prevChats[chatIndex].title;

      const updatedChat = {
        ...prevChats[chatIndex],
        messages: updatedMessages,
        title: newTitle,
        timestamp: new Date().getTime(),
      };

      const newChats = [
        updatedChat,
        ...prevChats.filter(c => c.id !== currentChatId)
      ];

      saveChats(newChats);
      return newChats;
    });

    const context = `
        You are MechaLink AI, an expert car mechanic and vehicle systems assistant.
        Answer this user's question clearly and practically.
        Use simple language. Avoid generic or overly technical words.
    `;

    const contents = [
      { parts: [{ text: context }] },
      ...messages.slice(-5).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const payload = { contents };

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
        const botMessage = { role: "bot", text: cleanText };

        setChats(prevChats => {
          const chatIndex = prevChats.findIndex(c => c.id === currentChatId);
          if (chatIndex === -1) return prevChats;

          const updatedMessages = [...prevChats[chatIndex].messages, botMessage];

          const updatedChat = {
            ...prevChats[chatIndex],
            messages: updatedMessages,
            timestamp: new Date().getTime(),
          };

          const newChats = [
            updatedChat,
            ...prevChats.filter(c => c.id !== currentChatId)
          ];

          saveChats(newChats);
          return newChats;
        });

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

  useEffect(() => {
    const chatWindow = document.getElementById("chat-messages");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages.length, currentChatId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="h-full bg-base-200 flex overflow-hidden">
      
      <div
        className={`z-30 w-80 bg-base-100 md:border-r border-neutral h-full transition-transform duration-300
          ${showSidebar ? "translate-x-0 fixed inset-y-0 left-0" : "-translate-x-full fixed inset-y-0 left-0"}
          md:relative md:translate-x-0 md:w-80 shadow-2xl md:shadow-none flex flex-col`}
      >
        <div className="p-4 border-b border-neutral bg-base-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-base-content py-2">Chat History</h2>
            <div className="flex items-center gap-2">
                {isClearButtonVisible && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-base-content hover:bg-base-300 rounded-lg transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>
                        
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-xl z-40 border border-neutral">
                                <button
                                    onClick={() => {
                                        clearAllChats();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error rounded-lg hover:bg-error/10 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Clear All Chats
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={() => setShowSidebar(false)}
                    className="md:hidden p-2 text-base-content hover:bg-base-300 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
          </div>

          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-content rounded-xl hover:bg-secondary transition-colors font-bold text-base shadow-lg shadow-primary/30"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        
        <div className="p-4 flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-base-content/30 mb-4" size={48} />
              <p className="text-base-content/70 font-medium">No history</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-base-content/50 uppercase mb-2 ml-1">Past Conversations</p>
              {chats.sort((a, b) => b.timestamp - a.timestamp).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 shadow-sm
                    ${chat.id === currentChatId
                      ? 'bg-primary/20 border border-primary/50 text-base-content font-semibold'
                      : 'bg-base-100 border border-neutral text-base-content hover:bg-base-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className={chat.id === currentChatId ? 'text-primary' : 'text-base-content/60'} />
                    <p className="text-sm line-clamp-1 flex-1 min-w-0">
                      {chat.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        
      </div>

      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        <div className="md:hidden bg-base-100 border-b border-neutral p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Wrench className="text-primary-content" size={20} />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-base-content tracking-tight">MechaLink AI</h1>
              <p className="text-xs text-base-content/70 line-clamp-1">{currentChat?.title || "New Chat"}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 text-base-content hover:bg-base-300 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto flex flex-col pt-4 md:pt-8 px-4" id="chat-messages-container">

          
          {messages.length === 0 && (
            <div className="text-center py-16 flex-1 flex flex-col justify-center items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                <Bot className="text-primary-content" size={40} />
              </div>
              <h1 className="text-4xl font-extrabold text-base-content mb-2 tracking-tighter">
                MechaLink AI
              </h1>
              <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
                Ask your first question about car repair, maintenance, or mechanical systems to get started.
              </p>
            </div>
          )}

          
          <div id="chat-messages" className="flex-1 pb-6 md:pb-8 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-xl shadow-lg border border-neutral
                    ${message.role === 'user'
                      ? 'bg-primary text-primary-content rounded-br-none'
                      : 'bg-base-100 text-base-content rounded-tl-none border-neutral'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
                      ${message.role === 'user'
                        ? 'bg-primary/80 text-primary-content'
                        : 'bg-base-200 text-primary'
                      }`}>
                      {message.role === 'user' ? <User size={16} /> : <Wrench size={16} />}
                    </div>
                    <p className="prose max-w-none text-base leading-relaxed whitespace-pre-line break-words text-inherit">
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-3xl p-4 rounded-xl shadow-lg border bg-base-100 text-base-content rounded-tl-none border-neutral">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-base-200 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wrench size={16} />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      MechaLink is typing...
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
        <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-4 md:pb-8 z-20">
          
          {error && (
            <div className="mb-4 animate-fade-in">
              <div className="bg-error/10 border border-error/20 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-error rounded-lg flex items-center justify-center flex-shrink-0">
                    <X className="text-error-content" size={16} />
                  </div>
                  <p className="text-error text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-base-100 rounded-3xl border border-neutral shadow-2xl p-6">
            <div className="flex flex-col gap-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your car..."
                rows={3}
                className="w-full px-5 py-4 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 resize-none text-base-content placeholder-base-content/50 transition-all duration-200 text-base"
                disabled={loading}
              />
              <div className="flex items-center justify-end">
                <button
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-content rounded-xl hover:bg-secondary disabled:bg-base-300 disabled:text-base-content/50 transition-all duration-300 font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-primary-content/40 border-t-primary-content rounded-full animate-spin" />
                      Getting Answer...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {showSidebar && (
        <div
          className="absolute inset-0 bg-black/50 z-20 md:hidden"
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
        .border-3 {
            border-width: 3px;
        }
      `}</style>
    </div>
  );
}