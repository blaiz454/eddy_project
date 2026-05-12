import { useEffect, useState } from "react";
import HeroBanner from "./HeroBanner";
import MovieRow from "./MovieRow";
import MoreDetails from "./MoreDetails";
import { getTrendingMovies } from "../api/tmdb";

function Trending() {
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrendingMovies();

      if (!data || data.length === 0) return;

      // HERO MOVIE
      setHeroMovie(data[0]);

      //  SIMPLE ROW SPLITTING
      const rowSize = 20;

      const trendingRows = [
        {
          title: "🔥 Trending Now",
          movies: data.slice(0, rowSize),
        },
        {
          title: "📺 More Trending",
          movies: data.slice(rowSize, rowSize * 2),
        },
        {
          title: "🎬 Latest Trending Picks",
          movies: data.slice(rowSize * 2, rowSize * 3),
        },
        {
          title: "⭐ Top Rated Trending",
          movies: [...data]
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, rowSize),
        },
        // ➕ NEW ROW 1
        {
          title: "🔥 Trending Worldwide Mix",
          movies: data.slice(5, 25),
        },
        // ➕ NEW ROW 2
        {
          title: "🎥 Popular Right Now",
          movies: data.slice(10, 30),
        },
      ];

      setRows(trendingRows);
    };

    fetchData();
  }, []);

  // CLICK HANDLER
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>

      {/* HERO */}
      <HeroBanner
        movie={heroMovie}
        onSelectMovie={handleSelectMovie}
      />

      {/*  MULTIPLE CLEAN ROWS */}
      {rows
        .filter((row) => row.movies && row.movies.length > 0)
        .map((row, index) => (
          <MovieRow
            key={index}
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

export default Trending;