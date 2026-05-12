const API_KEY = "6ef0e924214c3ce773dbc4b104a5e723";
const BASE_URL = "https://api.themoviedb.org/3";

// cache to reduce API calls
const trailerCache = {};

//SAFE REQUEST
const safeFetch = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return { results: [] };

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API error:", err);
    return { results: [] };
  }
};

//TRENDING
export const getTrendingMovies = async () => {
  const data = await safeFetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  return data.results || [];
};

// GENRE
export const getMoviesByGenre = async (genreId) => {
  const data = await safeFetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
  );
  return data.results || [];
};

//SEARCH 
export const searchMovies = async (query) => {
  const data = await safeFetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  return data.results || [];
};

//TRAILER 
export const getMovieTrailer = async (movie) => {
  if (!movie?.id) return null;

  if (trailerCache[movie.id]) return trailerCache[movie.id];

  const type =
    movie.media_type === "tv" || movie.name ? "tv" : "movie";

  const data = await safeFetch(
    `${BASE_URL}/${type}/${movie.id}/videos?api_key=${API_KEY}`
  );

  const trailer = data.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const key = trailer?.key || null;

  trailerCache[movie.id] = key;

  return key;
};