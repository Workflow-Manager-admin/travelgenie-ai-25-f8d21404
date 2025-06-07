# TravelGenie AI Backend Proxy

This lightweight Express backend securely proxies Cohere API chat requests so your secret key is **never exposed to browser code or the React frontend**.

---

## Quick Start

1. **Copy and configure environment:**
   ```
   cp .env.example .env
   ```
   - Put your real Cohere API key in `.env` (never commit secrets).

2. **Install dependencies:**
   ```
   npm install express node-fetch cors dotenv
   ```

3. **Start the backend:**
   ```
   node index.js
   # or for auto-reload: npx nodemon index.js
   ```

- By default, the backend runs on http://localhost:4001 and exposes:  
  **POST /api/cohere-chat**

---

## API Endpoint

**POST** `/api/cohere-chat`

- **Body (JSON):**  
  `{ message: <string, required>, chat_history?: <array, optional>, model?: <string, optional> }`
- **Returns:** Response from Cohere API (see Cohere docs).

---

## Security

- `.env` is for secrets—never commit it.
- The Cohere API key is only available server-side.
- The backend never sends the API key to the frontend.
- CORS: Open for development. Restrict `origin` for production deployments.

---

## How Your React App Should Call This API

**Never put the Cohere API key or Cohere endpoint in the frontend code.**  
Instead, send chat/post requests from React to this proxy endpoint (no API key required):

```js
const resp = await fetch("/api/cohere-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Your user question here",
    chat_history: [/* optional chat context: {role, message} */]
  })
});
const data = await resp.json();
```

- No Cohere API key or "Authorization" header is needed in React.
- The backend securely attaches the API key and relays requests to Cohere.
- For local React dev, if proxying fails, set up React's `proxy` config or use the full backend URL.

---

## Files

- `index.js` — Express app, Cohere proxy endpoint.
- `.env.example` — Template for backend environment variables.

---
