import { useState, useEffect, useRef } from "react";
import { searchMovies } from "../api/tmdb";

function SearchBar({ onSelectMovie = () => {} }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  // SEARCH
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      const data = await searchMovies(query);
      setResults(data.slice(0, 7));
      setLoading(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="search-bar"
      style={{ position: "relative" }}
    >
      <input
        className="navbar-search"
        value={query}
        placeholder="Search movies, series, anime"
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* LOADING */}
      {loading && (
        <div className="search-dropdown">
          <p style={{ padding: "10px" }}>Searching...</p>
        </div>
      )}

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="search-item"
              onClick={() => {
                onSelectMovie?.(movie);
                setQuery("");
                setResults([]);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px",
                gap: "10px",
              }}
            >
              {/* IMAGE QUALITY */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                    : "https://image.tmdb.org/t/p/w154/placeholder.jpg"
                }
                alt={movie.title || movie.name}
                style={{
                  width: "50px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />

              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                {movie.title || movie.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && query && results.length === 0 && (
        <div className="search-dropdown">
          <p style={{ padding: "10px" }}>No results found</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;