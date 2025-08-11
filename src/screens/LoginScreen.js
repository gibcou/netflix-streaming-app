import React, { useState, useEffect } from 'react';
import axios from '../axios';
import requests from '../requests';
import './LoginScreen.css';
import SignupScreen from './SignupScreen';

function LoginScreen({ onAuth }) {
  const [signIn, setSignIn] = useState(false);
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchMovies() {
      try {
        const request = await axios.get(requests.fetchPopularMovies);
        setMovies(request.data.results.slice(0, 20)); // Get first 20 movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= movies.length - 5 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, movies.length - 5) : prevIndex - 1
    );
  };

  return (
    <div className="loginScreen">
      <div className="loginScreen__background">
        <img
          className="loginScreen__logo"
          src="/netflix-logo.svg"
          alt="Netflix Logo"
        />
        <button 
          onClick={() => setSignIn(true)}
          className="loginScreen__button"
        >
          Sign In
        </button>

        <div className="loginScreen__gradient" />
      </div>

      <div className="loginScreen__body">
        {signIn ? (
          <SignupScreen onAuth={onAuth} initialMode="signin" />
        ) : (
          <>
            <h1>Unlimited movies, TV shows, and more.</h1>
            <h2>Watch anywhere. Cancel anytime.</h2>
            <h3>
              Ready to watch? Enter your email to create or restart your membership.
            </h3>

            <div className="loginScreen__input">
              <form>
                <input type="email" placeholder="Email address" />
                <button 
                  onClick={() => setSignIn(true)}
                  className="loginScreen__getStarted"
                >
                  GET STARTED
                </button>
              </form>
            </div>

            {/* Movie Carousel */}
            {movies.length > 0 && (
              <div className="loginScreen__carousel">
                <h2>Popular on Netflix</h2>
                <div className="carousel__container">
                  <button className="carousel__button carousel__button--left" onClick={prevSlide}>
                    &#8249;
                  </button>
                  <div className="carousel__track">
                    <div 
                      className="carousel__slides"
                      style={{ transform: `translateX(-${currentIndex * 20}%)` }}
                    >
                      {movies.map((movie) => (
                        <div key={movie.id} className="carousel__slide">
                          <img
                            src={`${base_url}${movie.poster_path}`}
                            alt={movie.title}
                            className="carousel__poster"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="carousel__info">
                            <h4>{movie.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="carousel__button carousel__button--right" onClick={nextSlide}>
                    &#8250;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;