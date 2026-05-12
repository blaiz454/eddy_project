import { useEffect, useState } from "react";
import HeroBanner from "./HeroBanner";
import MovieRow from "./MovieRow";
import MoreDetails from "./MoreDetails";
import { getTrendingMovies, getMoviesByGenre } from "../api/tmdb";

function Home({
  selectedMovie,
  setSelectedMovie,
  heroMovie,
  setHeroMovie,
}) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [animeMovies, setAnimeMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const trending = await getTrendingMovies();
      const action = await getMoviesByGenre(28);
      const comedy = await getMoviesByGenre(35);
      const anime = await getMoviesByGenre(16);

      setTrendingMovies(trending || []);
      setActionMovies(action || []);
      setComedyMovies(comedy || []);
      setAnimeMovies(anime || []);

      if (!heroMovie && trending?.length > 0) {
        setHeroMovie(trending[0]);
      }
    };

    fetchMovies();
  }, [heroMovie, setHeroMovie]);

  return (
    <div>

      <HeroBanner movie={heroMovie} onSelectMovie={setSelectedMovie} />

      <MovieRow title="Trending Now" movies={trendingMovies} onSelectMovie={setSelectedMovie} />
      <MovieRow title="Action Movies" movies={actionMovies} onSelectMovie={setSelectedMovie} />
      <MovieRow title="Comedy Movies" movies={comedyMovies} onSelectMovie={setSelectedMovie} />
      <MovieRow title="Anime" movies={animeMovies} onSelectMovie={setSelectedMovie} />

      {selectedMovie && (
        <MoreDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

    </div>
  );
}

export default Home;