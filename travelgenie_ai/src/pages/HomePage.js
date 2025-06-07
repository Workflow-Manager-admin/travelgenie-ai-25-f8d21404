import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function HomePage() {
  /** Home Page: Overview and navigation to all features of TravelGenie AI */
  return (
    <div>
      <section className="hero">
        <div className="subtitle">Smart Planning. Happy Travels.</div>
        <h2 className="title" style={{ marginTop: '0.6em' }}>
          Welcome to TravelGenie AI!
        </h2>
        <div className="description">
          Your all-in-one, AI-powered travel planner. Create personalized itineraries, check real-time weather, plan routes, and chat with an AI travel assistant.<br/><br/>
          Get started by exploring the features below:
        </div>
        <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          <Link to="/itinerary" className="btn btn-large">AI Itinerary Generator</Link>
          <Link to="/map" className="btn btn-large">Interactive Map</Link>
          <Link to="/weather" className="btn btn-large">Weather Checker</Link>
          <Link to="/chat" className="btn btn-large">AI Chatbot</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
