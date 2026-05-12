import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getMovieTrailer } from "../api/tmdb";
import WatchlistInsights from "./WatchlistInsights";
import "./watchlist.css";

function Watchlist() {
  const [list, setList] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const hoverTimeout = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    const fetchWatchlist = async () => {
      const res = await axios.get(
        `https://eddytwiga.alwaysdata.net/api/get_watchlist/${user.id}`
      );

      setList(res.data || []);
    };

    fetchWatchlist();
  }, [user?.id]);

  const getStatuses = () => {
    return JSON.parse(localStorage.getItem("watchlistStatus")) || {};
  };

  const saveStatuses = (data) => {
    localStorage.setItem("watchlistStatus", JSON.stringify(data));
  };

  const updateStatus = (movieId, status) => {
    const current = getStatuses();

    current[movieId] = status;

    saveStatuses(current);

    setList((prev) => [...prev]);
  };

  const removeItem = async (movieId) => {
    await axios.post(
      "https://eddytwiga.alwaysdata.net/api/remove_from_watchlist",
      {
        user_id: user.id,
        movie_id: movieId,
      }
    );

    setList((prev) => prev.filter((m) => m.movie_id !== movieId));
  };

  const handleHover = (item) => {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(async () => {
      setHoveredId(item.movie_id);
      const key = await getMovieTrailer({ id: item.movie_id });
      setTrailerKey(key);
    }, 250);
  };

  const clearHover = () => {
    clearTimeout(hoverTimeout.current);
    setHoveredId(null);
    setTrailerKey(null);
  };

  const statuses = getStatuses();

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>

      <div className="watchlist-insights-wrapper">
        <WatchlistInsights />
      </div>

      {!user ? (
        <p>Please login first</p>
      ) : list.length === 0 ? (
        <p>No movies added yet.</p>
      ) : (
        <div className="watchlist-grid">
          {list.map((item) => {
            const id = item.movie_id;

            return (
              <div
                key={id}
                className="watch-card"
                onMouseEnter={() => handleHover(item)}
                onMouseLeave={clearHover}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${
                    item.poster || item.poster_path || ""
                  }`}
                  alt={item.title}
                />

                <h4>{item.title || item.movie_title}</h4>

                <div className="status-container">
                  <select
                    value={statuses[id] || "plan"}
                    onChange={(e) => updateStatus(id, e.target.value)}
                    className="status-select"
                  >
                    <option value="plan">📌 Plan to Watch</option>
                    <option value="continue">▶ Continue Watching</option>
                    <option value="dropped">❌ Dropped</option>
                  </select>
                </div>

                <button onClick={() => removeItem(id)}>Remove</button>

                {hoveredId === id && trailerKey && (
                  <div className="hover-preview">
                    <iframe
                      className="hover-trailer"
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
                      allow="autoplay" title="watchlist-video"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Watchlist;