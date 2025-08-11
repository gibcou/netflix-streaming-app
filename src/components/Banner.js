import React, { useState, useEffect } from 'react';
import axios from '../axios';
import requests from '../requests';
import './Banner.css';

function Banner() {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(requests.fetchNetflixOriginals);
        console.log("Banner API Response:", request.data);
        
        // Filter movies that have backdrop_path
        const moviesWithBackdrop = request.data.results.filter(movie => movie.backdrop_path);
        
        if (moviesWithBackdrop.length > 0) {
          setMovie(
            moviesWithBackdrop[
              Math.floor(Math.random() * moviesWithBackdrop.length)
            ]
          );
        } else {
          console.log("No movies with backdrop found");
        }
        
        return request;
      } catch (error) {
        console.error("Banner API Error:", error);
      }
    }

    fetchData();
  }, []);

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: movie?.backdrop_path 
          ? `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")` 
          : 'linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.61), #111)',
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(
            `${movie?.overview}`,
            150
          )}
        </h1>
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;