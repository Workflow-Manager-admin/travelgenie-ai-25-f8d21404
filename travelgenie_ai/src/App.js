import React from 'react';
import './App.css';

// React Router imports
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Page components
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import MapPage from './pages/MapPage';
import WeatherPage from './pages/WeatherPage';
import ChatPage from './pages/ChatPage';

// PUBLIC_INTERFACE
function App() {
  /** App Entry Point: Handles page routing and navigation */
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> TravelGenie AI
              </div>
              <div>
                <Link to="/" className="btn" style={{marginRight: "8px"}}>Home</Link>
                <Link to="/itinerary" className="btn" style={{marginRight: "8px"}}>Itinerary</Link>
                <Link to="/map" className="btn" style={{marginRight: "8px"}}>Map</Link>
                <Link to="/weather" className="btn" style={{marginRight: "8px"}}>Weather</Link>
                <Link to="/chat" className="btn">Chat</Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="container" style={{ paddingTop: 120 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;