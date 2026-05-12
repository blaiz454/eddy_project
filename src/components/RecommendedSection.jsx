import { useEffect, useState, useCallback } from "react";
import HeroBanner from "./HeroBanner";
import MovieRow from "./MovieRow";
import MoreDetails from "./MoreDetails";
import { getMoviesByGenre } from "../api/tmdb";

function Recommended() {
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rows, setRows] = useState([]);

  // CHARACTER DETECTION SYSTEM
  const detectCharacterType = (movie) => {
    const text = (movie.overview || "").toLowerCase();

    let types = [];

    if (
      text.includes("power") ||
      text.includes("strong") ||
      text.includes("legend") ||
      text.includes("hero")
    ) {
      types.push("op_mc");
    }

    if (
      text.includes("villain") ||
      text.includes("revenge") ||
      text.includes("dark") ||
      text.includes("evil")
    ) {
      types.push("villain");
    }

    if (
      text.includes("love") ||
      text.includes("romance") ||
      text.includes("relationship")
    ) {
      types.push("romance");
    }

    if (
      text.includes("shy") ||
      text.includes("quiet") ||
      text.includes("introvert")
    ) {
      types.push("shy");
    }

    return types;
  };

  const updateCharacterMemory = (movie) => {
    const stored = JSON.parse(localStorage.getItem("characterProfile")) || {};
    const detected = detectCharacterType(movie);

    detected.forEach((type) => {
      stored[type] = (stored[type] || 0) + 1;
    });

    localStorage.setItem("characterProfile", JSON.stringify(stored));
  };

  // FIXED ESLINT WARNING
  const getCharacterBoost = useCallback((movie) => {
    const profile = JSON.parse(localStorage.getItem("characterProfile")) || {};
    const detected = detectCharacterType(movie);

    let boost = 0;

    detected.forEach((type) => {
      if (profile[type]) {
        boost += profile[type] * 2;
      }
    });

    return boost;
  }, []);

  // GLOBAL DEDUPLICATION FUNCTION
  const dedupeMovies = (movies) => {
    const map = new Map();

    movies.forEach((movie) => {
      if (!movie || !movie.id) return;

      if (!map.has(movie.id)) {
        map.set(movie.id, movie);
      }
    });

    return Array.from(map.values());
  };

  // MAIN DATA FETCH
  useEffect(() => {
    const fetchData = async () => {
      const action = await getMoviesByGenre(28);
      const comedy = await getMoviesByGenre(35);
      const animation = await getMoviesByGenre(16);

      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const viewedGenres =
        JSON.parse(localStorage.getItem("viewedGenres")) || {};

      // AI SCORING
      const getScore = (movie, baseWeight) => {
        let score = baseWeight;

        if (watchlist.some((m) => m.movie_id === movie.id)) {
          score += 5;
        }

        if (movie.genre_ids) {
          movie.genre_ids.forEach((id) => {
            if (viewedGenres[id]) {
              score += viewedGenres[id] * 2;
            }
          });
        }

        score += getCharacterBoost(movie);

        if (movie.vote_average) {
          score += movie.vote_average / 2;
        }

        score += Math.random() * 2;

        return score;
      };

      const buildRow = (title, list, weight) => {
        if (!list) return { title, movies: [] };

        // DEDUPLICATE BEFORE SCORING
        const uniqueList = dedupeMovies(list);

        const scored = uniqueList
          .map((movie) => ({
            ...movie,
            score: getScore(movie, weight),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 20);

        return { title, movies: scored };
      };

      const allRows = [
        buildRow(
          " Top Matches For You",
          dedupeMovies([...action, ...comedy, ...animation]),
          3
        ),
        buildRow(" Action Picks", action, 4),
        buildRow(" Comedy Picks", comedy, 3),
        buildRow(" Animation Picks", animation, 2),
        buildRow(
          " Trending in Your Taste",
          dedupeMovies([...action, ...comedy]),
          2
        ),
      ];

      setRows(allRows);

      // HERO
      const allMovies = dedupeMovies([
        ...action,
        ...comedy,
        ...animation,
      ])
        .map((m) => ({
          ...m,
          score: getScore(m, 3),
        }))
        .sort((a, b) => b.score - a.score);

      setHeroMovie(allMovies[0] || null);
    };

    fetchData();
  }, [getCharacterBoost]);

  // USER INTERACTION
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);

    const viewedGenres =
      JSON.parse(localStorage.getItem("viewedGenres")) || {};

    if (movie.genre_ids) {
      movie.genre_ids.forEach((id) => {
        viewedGenres[id] = (viewedGenres[id] || 0) + 1;
      });
    }

    localStorage.setItem("viewedGenres", JSON.stringify(viewedGenres));

    updateCharacterMemory(movie);
  };

  return (
    <div>
      {/* HERO */}
      <HeroBanner
        movie={heroMovie}
        onSelectMovie={handleSelectMovie}
      />

      {/* ROWS */}
      {rows.map((row, index) => (
        <MovieRow
          key={`${row.title}-${index}`}
          title={row.title}
          movies={row.movies}
          onSelectMovie={handleSelectMovie}
        />
      ))}

      {/* MODAL */}
      {selectedMovie && (
        <MoreDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default Recommended;