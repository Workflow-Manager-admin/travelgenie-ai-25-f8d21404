import React, { useState } from "react";

/**
 * WeatherPage: Inputs destination city, fetches weather from OpenWeatherMap using API key from .env.
 */
// PUBLIC_INTERFACE
function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (e) => {
    e.preventDefault();
    setWeather(null);
    setForecast([]);
    setError("");
    setLoading(true);
    const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
    const units = "metric";
    let cityQuery = city.trim();
    if (!cityQuery) {
      setError("Please enter a city.");
      setLoading(false);
      return;
    }
    try {
      // Current weather
      const resCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&appid=${apiKey}&units=${units}`
      );
      if (!resCurrent.ok) throw new Error("Weather API error");
      const current = await resCurrent.json();

      // 5-day forecast (3-hour intervals)
      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityQuery)}&appid=${apiKey}&units=${units}`
      );
      let daily = [];
      if (resForecast.ok) {
        const forecastData = await resForecast.json();
        // Group by day, take the forecast around midday for each
        const grouped = {};
        for (const entry of forecastData.list) {
          const day = entry.dt_txt.split(" ")[0];
          if (!grouped[day] || entry.dt_txt.includes("12:00:00")) {
            grouped[day] = entry;
          }
        }
        // Omit current day, show next 4
        daily = Object.values(grouped).slice(1, 5);
      }
      setWeather(current);
      setForecast(daily);
    } catch (err) {
      setError("Failed to get weather. Check city and API key.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Weather Checker</h2>
      <form onSubmit={fetchWeather} style={{ marginBottom: 24 }}>
        <label>
          Destination City:
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ marginLeft: 8, padding: 5, borderRadius: 3, border: '1px solid #222', marginTop: 4 }}
            placeholder="e.g. Paris"
            required
          />
        </label>
        <button type="submit" className="btn btn-large" style={{ marginLeft: 14 }} disabled={loading}>
          {loading ? "Loading..." : "Check Weather"}
        </button>
      </form>
      {error && <div style={{ color: "#FFB300", marginBottom: 11 }}>{error}</div>}
      {weather && (
        <div>
          <h3 style={{ marginBottom: 3 }}>{weather.name} ({weather.sys.country})</h3>
          <div style={{ marginBottom: 6 }}>
            <b>Now:</b> {weather.weather[0].main} - <span>{weather.weather[0].description}</span><br />
            <b>Temp:</b> {Math.round(weather.main.temp)}°C &nbsp; |&nbsp;
            Feels like: {Math.round(weather.main.feels_like)}°C<br />
            <b>Humidity:</b> {weather.main.humidity}% &nbsp; |&nbsp; <b>Wind:</b> {weather.wind.speed} m/s
          </div>
        </div>
      )}
      {forecast.length > 0 && (
        <div>
          <h4 style={{ marginTop: 22, marginBottom: 4 }}>5-Day Forecast</h4>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {forecast.map((f, idx) =>
              <div key={f.dt} style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 7, padding: '13px 16px',
                minWidth: 115,
                textAlign: 'center',
                fontSize: 15
              }}>
                <div>{new Date(f.dt_txt).toLocaleDateString()}</div>
                <div>{f.weather[0].main} <span style={{ fontSize: 13, color: "#ace" }}>({f.weather[0].description})</span></div>
                <div>
                  <b>{Math.round(f.main.temp)}°C</b>
                  <div style={{ fontSize: 13 }}>({Math.round(f.main.feels_like)}°C feels)</div>
                </div>
                <div style={{ fontSize: 13 }}>Humidity: {f.main.humidity}%</div>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}

export default WeatherPage;
