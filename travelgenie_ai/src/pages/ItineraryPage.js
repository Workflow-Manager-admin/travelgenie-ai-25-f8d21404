import React, { useState } from "react";

/**
 * ItineraryPage: collects trip details, calls Cohere for AI-generated itinerary.
 * Uses API key from process.env.REACT_APP_COHERE_API_KEY.
 */
// PUBLIC_INTERFACE
function ItineraryPage() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setItinerary("");
    setLoading(true);

    const days = (new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000) + 1;
    const prompt = `Create a ${days}-day travel itinerary for ${destination} from ${startDate} to ${endDate}. Preferences: ${preferences || "no special preferences"}. Output format: day-by-day plan.`;

    try {
      const resp = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`
        },
        body: JSON.stringify({
          model: "command-r-plus",
          message: prompt
        })
      });

      if (!resp.ok) throw new Error("API request failed");
      const data = await resp.json();
      setItinerary(data.text || data.response || JSON.stringify(data, null, 2));
    } catch (err) {
      setError("Failed to fetch itinerary. Check your inputs and API key.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>AI Itinerary Generator</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, maxWidth: 480 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Destination:<br/>
            <input value={destination} required onChange={e => setDestination(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Start Date:<br/>
            <input type="date" value={startDate} required onChange={e => setStartDate(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>End Date:<br/>
            <input type="date" value={endDate} required onChange={e => setEndDate(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Preferences (optional):<br/>
            <input
              value={preferences}
              onChange={e => setPreferences(e.target.value)}
              placeholder="e.g., art, food, outdoors"
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-large" disabled={loading}>
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {error && <div style={{ color: "#FFB300", marginBottom: 16 }}>{error}</div>}
      {itinerary && (
        <div>
          <h3>Suggested Itinerary:</h3>
          <pre style={{
            background: "rgba(255,255,255,0.08)",
            padding: 20,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            fontSize: 15,
            maxHeight: 420,
            overflow: "auto"
          }}>{itinerary}</pre>
        </div>
      )}
      
    </div>
  );
}

export default ItineraryPage;
