require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

// --- Modular middlewares
const app = express();
app.use(express.json());

// CORS: Open for dev, restrict 'origin' for production!
app.use(cors({
  origin: "*", // TODO: Replace with your frontend origin for deployment.
}));

// --- Cohere Proxy Handler Module ---
/**
 * Validates and proxies chat requests to Cohere API, never exposing the key.
 * Accepts { message, chat_history? }. Validates input. Calls Cohere, returns safe response.
 */
async function handleCohereChat(req, res) {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "Cohere API key not set on server" });

  const { message, chat_history, model } = req.body || {};

  // Safety: Simple user input validation
  if (typeof message !== "string" || !message.trim())
    return res.status(400).json({ error: "Prompt message is required" });

  if (chat_history && !Array.isArray(chat_history))
    return res.status(400).json({ error: "chat_history must be an array" });

  // Compose Cohere payload (only send valid fields)
  const requestBody = {
    model: model || "command-r-plus",
    message: message.trim(),
    ...(chat_history && chat_history.length
      ? { chat_history } : {})
  };

  try {
    // Make call to Cohere API
    const resp = await fetch(
      "https://api.cohere.ai/v1/chat",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (!resp.ok) {
      const msg = await resp.text();
      return res.status(resp.status).json({ error: "Cohere API error", details: msg });
    }
    const data = await resp.json();
    // Only return safe/essentials to frontend
    res.json({
      text: data.text || data.response,
      generationId: data.generation_id,
      references: data.references
    });
  } catch (err) {
    res.status(502).json({ error: "Proxy error", details: String(err.message || err) });
  }
}

// PUBLIC_INTERFACE
app.post('/api/cohere-chat', handleCohereChat);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`[Backend] Cohere proxy running on port ${PORT}`);
});
