require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // TODO: restrict in production!
}));

// PUBLIC_INTERFACE
app.post('/api/cohere-chat', async (req, res) => {
  /**
   * Proxies chat requests to Cohere API securely. Keeps API key out of frontend.
   * Receives: { message: string, chat_history: array, ... }
   * Forwards to Cohere API, returns relevant response.
   */
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Cohere API key not set on server" });

  const { message, chat_history, model } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  // Construct payload
  const body = {
    model: model || "command-r-plus",
    message,
    ...chat_history ? { chat_history } : {}
  };

  try {
    const cohereResp = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!cohereResp.ok) {
      const text = await cohereResp.text();
      return res.status(cohereResp.status).json({ error: "Cohere API error", details: text });
    }
    const data = await cohereResp.json();
    // Filter (only return essentials)
    const result = {
      text: data.text || data.response,
      generationId: data.generation_id,
      references: data.references
    };
    res.json(result);
  } catch (e) {
    res.status(502).json({ error: "Proxy error", details: e.message });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`[Backend] Cohere proxy running on port ${PORT}`);
});
