import React, { useState, useRef, useEffect } from "react";

/**
 * ChatPage: AI chat assistant for travel, using Cohere API and .env key.
 */
// PUBLIC_INTERFACE
function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your TravelGenie AI assistant. Ask me anything about your trip, destinations, packing, airlines, budgeting, attractions and more!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    setLoading(true);

    const userMsg = { role: "user", text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    try {
      // Use last 10 messages as context. (Simple chat context)
      const conv = [...messages, userMsg].slice(-10);

      // "message_history" for Cohere works like: [{role, message}]
      const cohereMsgs = conv.map(m => ({ role: m.role, message: m.text }));

      const resp = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`
        },
        body: JSON.stringify({
          model: "command-r-plus",
          message: input,
          chat_history: cohereMsgs.filter(m => m.role !== "user").map(
            m => ({ role: m.role, message: m.message })
          )
        })
      });
      if (!resp.ok) throw new Error("API error");
      const data = await resp.json();
      const reply = data.text || data.response || JSON.stringify(data, null, 2);
      setMessages(msgs => [...msgs, { role: "assistant", text: reply }]);
    } catch (err) {
      setError("Failed to get response. Check API key and connection.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>AI Travel Chatbot</h2>
      <div
        ref={chatContainerRef}
        style={{
          background: "rgba(255,255,255,0.07)",
          borderRadius: 6,
          minHeight: 220,
          maxHeight: 380,
          overflowY: "auto",
          padding: "20px 15px",
          marginBottom: 12,
        }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{
            marginBottom: 11,
            textAlign: m.role === "user" ? "right" : "left"
          }}>
            <span style={{
              display: "inline-block",
              background: m.role === "user" ? "var(--base-light)" : "#323f59",
              color: m.role === "user" ? "#000" : "#fff",
              borderRadius: 6,
              padding: "9px 13px",
              maxWidth: "85%",
              fontSize: 16,
              wordBreak: "break-word"
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: 9,
            borderRadius: 4,
            border: "1px solid #222"
          }}
          disabled={loading}
        />
        <button
          className="btn"
          type="submit"
          disabled={loading || !input.trim()}
          style={{ minWidth: 85 }}>
          {loading ? "..." : "Send"}
        </button>
      </form>
      {error && <div style={{ color: "#FFB300", marginTop: 7 }}>{error}</div>}
      
    </div>
  );
}

export default ChatPage;
