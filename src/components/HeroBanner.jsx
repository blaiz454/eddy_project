import { useEffect, useState } from "react";
import { getMovieTrailer } from "../api/tmdb";
import { getUserIdentity } from "../utils/identity";

function HeroBanner({ movie, onSelectMovie }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const identity = getUserIdentity();

  useEffect(() => {
    const fetchTrailer = async () => {
      const key = await getMovieTrailer(movie);
      setTrailerKey(key);
      setShowTrailer(false);
    };

    if (movie) fetchTrailer();
  }, [movie]);

  if (!movie) return null;

  const imgBase = "https://image.tmdb.org/t/p/original";

  return (
    <div className="hero-banner" style={{ height: "75vh", position: "relative", overflow: "hidden" }}>

      {!showTrailer && (
        <div
          style={{
            backgroundImage: `url(${imgBase}${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        />
      )}

      {showTrailer && trailerKey && (
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=0&loop=1&playlist=${trailerKey}`}
          title="Hero Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", zIndex: 1 }}
        />
      )}

      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2 }} />

      <div className="hero-overlay" style={{ position: "relative", zIndex: 3 }}>

        {/*  IDENTITY BADGE */}
        <div style={{
          background: "rgba(0,0,0,0.7)",
          padding: "6px 12px",
          borderRadius: "20px",
          display: "inline-block",
          marginBottom: "10px",
          color: "#00e5ff",
          fontWeight: "bold"
        }}>
          {identity}
        </div>

        <h1>{movie.title || movie.name}</h1>

        <p>{movie.overview?.slice(0, 160) || "No description available."}</p>

        <div className="hero-buttons">
          {trailerKey && (
            <button className="button" onClick={() => setShowTrailer(true)}>
              ▶ Play Trailer
            </button>
          )}

          {showTrailer && (
            <button className="button secondary" onClick={() => setShowTrailer(false)}>
              ✖ Stop Trailer
            </button>
          )}

          <button className="button secondary" onClick={() => onSelectMovie(movie)}>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;