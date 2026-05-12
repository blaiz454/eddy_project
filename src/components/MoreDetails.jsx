import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getMovieTrailer } from "../api/tmdb";
import { trackAdClick } from "./AdTracker";
import { trackSponsoredClick } from "./SponsoredTracker";
import "./MoreDetails.css";

const API_KEY = "6ef0e924214c3ce773dbc4b104a5e723";

function MoreDetails({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [providers, setProviders] = useState({
    flatrate: [],
    rent: [],
    buy: [],
  });
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(null);
  const [adding, setAdding] = useState(false);

  const historySavedRef = useRef(null);

  const showAlert = (msg) => {
    setAlert(msg);
    setTimeout(() => setAlert(null), 2500);
  };

  const affiliateLinks = {
    Netflix: "https://www.netflix.com",
    "Amazon Prime Video": "https://www.primevideo.com",
    "Disney Plus": "https://www.disneyplus.com",
    Apple: "https://tv.apple.com",
    MovieBox: "https://moviebox.ng",
  };

  const addToWatchlist = async (e) => {
    e.stopPropagation();
    if (adding) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      showAlert(" Please login first");
      return;
    }

    try {
      setAdding(true);

      await axios.post(
        "https://eddytwiga.alwaysdata.net/api/add_to_watchlist",
        {
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title || movie.name,
          poster: movie.poster_path,
        }
      );

      showAlert("Added to watchlist");

      window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (err) {
      console.error(err);
      showAlert(" Failed to add");
    } finally {
      setAdding(false);
    }
  };

  // WATCH HISTORY TRACKING
  useEffect(() => {
    if (!movie?.id) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    if (historySavedRef.current === movie.id) return;

    const saveWatchHistory = async () => {
      try {
        await axios.post(
          "https://eddytwiga.alwaysdata.net/api/save_watch_history",
          {
            user_id: user.id,
            movie_id: movie.id,
            title: movie.title || movie.name,
          }
        );

        historySavedRef.current = movie.id;
      } catch (err) {
        console.log("Watch history tracking failed");
      }
    };

    saveWatchHistory();
  }, [movie]);

  // GLOBAL PROVIDERS FETCH
  const fetchGlobalProviders = async (id) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
      );

      const results = res.data.results;

      const regions = ["US", "GB", "CA", "AU", "IN"];

      let combined = { flatrate: [], rent: [], buy: [] };

      regions.forEach((region) => {
        const data = results[region];
        if (!data) return;

        ["flatrate", "rent", "buy"].forEach((type) => {
          if (data[type]) {
            combined[type] = [...combined[type], ...data[type]];
          }
        });
      });

      const unique = (arr) =>
        Array.from(new Map(arr.map((p) => [p.provider_id, p])).values());

      return {
        flatrate: unique(combined.flatrate),
        rent: unique(combined.rent),
        buy: unique(combined.buy),
      };
    } catch (err) {
      console.error(err);
      return { flatrate: [], rent: [], buy: [] };
    }
  };

  useEffect(() => {
    if (!movie) return;

    const fetchData = async () => {
      setLoading(true);

      const [key, watchData] = await Promise.all([
        getMovieTrailer(movie),
        fetchGlobalProviders(movie.id),
      ]);

      setTrailerKey(key);
      setProviders(watchData);
      setLoading(false);
    };

    fetchData();
  }, [movie]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!movie) return null;

  const noProviders =
    providers.flatrate.length === 0 &&
    providers.rent.length === 0 &&
    providers.buy.length === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content netflix-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <h2>{movie.title || movie.name}</h2>

        {alert && <div className="modal-alert">{alert}</div>}

        <button
          className="add-watchlist-btn"
          onClick={addToWatchlist}
          disabled={adding}
        >
          {adding ? "Adding..." : "➕ Add to Watchlist"}
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : trailerKey ? (
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        ) : (
          <p>No trailer available</p>
        )}

        <p className="overview">
          {movie.overview || "No description available."}
        </p>

        {!loading && (
          <div className="providers-section">
            <h3>Where to Watch</h3>

            {["flatrate", "rent", "buy"].map((type) =>
              providers[type].length > 0 ? (
                <div key={type}>
                  <h4>
                    {type === "flatrate"
                      ? "Stream"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </h4>

                  <div className="providers-list">
                    {providers[type].map((p) => (
                      <a
                        key={p.provider_id}
                        href={
                          affiliateLinks[p.provider_name] ||
                          `https://www.google.com/search?q=${p.provider_name}+watch`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="provider-btn"
                        onClick={() => {
                          trackAdClick(p.provider_name);
                          trackSponsoredClick(p.provider_name);
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                          alt={p.provider_name}
                        />
                        <span>{p.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null
            )}

            {noProviders && (
              <p className="no-providers">
                No streaming platforms found globally for this title.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoreDetails;