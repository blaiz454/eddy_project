import { useRef, useState, useEffect } from "react";
import { getMovieTrailer } from "../api/tmdb";

function MovieRow({ title, movies = [], onSelectMovie }) {
  const rowRef = useRef(null);

  const [hoveredId, setHoveredId] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const hoverTimeout = useRef(null);
  const activeRequest = useRef(null);

  // SCROLL
  const scroll = (direction) => {
    if (!rowRef.current) return;

    const amount = rowRef.current.offsetWidth;

    rowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // HOVER (SAFE + CANCEL PREVIOUS REQUESTS)
  const handleHover = (movie) => {
    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(async () => {
      setHoveredId(movie.id);

      // cancel previous trailer request logic (prevents race bugs)
      activeRequest.current = movie.id;

      const key = await getMovieTrailer(movie);

      // only update if still hovering same movie
      if (activeRequest.current === movie.id) {
        setTrailerKey(key);
      }
    }, 600);
  };

  // CLEAR HOVER SAFELY
  const clearHover = () => {
    clearTimeout(hoverTimeout.current);
    activeRequest.current = null;
    setHoveredId(null);
    setTrailerKey(null);
  };

  // CLICK (PRIORITY OVERRIDE)
  const handleClick = (movie) => {
    clearTimeout(hoverTimeout.current);
    activeRequest.current = null;

    setHoveredId(null);
    setTrailerKey(null);

    if (onSelectMovie) onSelectMovie(movie);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CLEANUP ON UNMOUNT (IMPORTANT FIX)
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout.current);
      activeRequest.current = null;
    };
  }, []);

  return (
    <div className="movie-row">
      <h3>{title}</h3>

      <div className="carousel-container">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          ◀
        </button>

        <div className="movie-row-scroll" ref={rowRef}>
          {movies.map((movie, index) => {
            
            const key = `${movie.id ?? movie.title ?? movie.name ?? "movie"}-${
              movie.media_type ?? "type"
            }-${index}`;

            return (
              <div
                key={key}
                className="movie-card-wrapper"
                onMouseEnter={() => handleHover(movie)}
                onMouseLeave={clearHover}
                onClick={() => handleClick(movie)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "/no-image.png"
                  }
                  alt={movie.title || movie.name || "Movie"}
                  className="movie-card"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />

                {hoveredId === movie.id && trailerKey && (
                  <div className="hover-preview">
                    <iframe
                      className="hover-trailer"
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
                      title="preview"
                      allow="autoplay"
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          ▶
        </button>
      </div>
    </div>
  );
}

export default MovieRow;