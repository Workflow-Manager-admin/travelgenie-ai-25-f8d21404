# TravelGenie AI Backend Proxy

This Express backend securely proxies Cohere API requests so the secret key is never exposed to the browser code.

## Setup

1. `cp .env.example .env` — Put your real Cohere key in `.env`.
2. `npm install express node-fetch cors dotenv`
3. `node index.js` (or use nodemon for dev)

The proxy API is now available on `http://localhost:4001/api/cohere-chat`

## Security

- Never commit `.env` with keys.
- The Cohere API key is only available server-side.

## Frontend Integration

**Instead of calling Cohere directly, your React app should:**

```js
const resp = await fetch("/api/cohere-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: prompt, chat_history })
});
const data = await resp.json();
```

- For local React dev, you may need a proxy (see React docs) or change the `origin` in backend CORS config.

## Files

- `index.js` — Express app, Cohere proxy endpoint.
