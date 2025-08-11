const API_KEY = process.env.REACT_APP_TMDB_API_KEY; // Your TMDB API key from .env file

const requests = {
  // Mixed Content
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  
  // Movies
  fetchTopRatedMovies: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchPopularMovies: `/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchSciFiMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878`,
  fetchThrillerMovies: `/discover/movie?api_key=${API_KEY}&with_genres=53`,
  
  // TV Shows
  fetchTopRatedTVShows: `/tv/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchPopularTVShows: `/tv/popular?api_key=${API_KEY}&language=en-US`,
  fetchActionTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=10759`,
  fetchComedyTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=35`,
  fetchDramaTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=18`,
  fetchSciFiTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=10765`,
  fetchCrimeTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=80`,
  fetchDocumentaryTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=99`,
  fetchAnimationTVShows: `/discover/tv?api_key=${API_KEY}&with_genres=16`,
};

export default requests;