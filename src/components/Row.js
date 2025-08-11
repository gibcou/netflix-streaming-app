import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import './Row.css';

function Row({ title, fetchUrl, isLargeRow = false, onAddToMyList, onRemoveFromMyList, isInMyList }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        console.log(`Row "${title}" API Response:`, request.data);
        setMovies(request.data.results);
        return request;
      } catch (error) {
        console.error(`Row "${title}" API Error:`, error);
      }
    }

    fetchData();
  }, [fetchUrl, title]);

  // Auto-scroll effect
  useEffect(() => {
    const startAutoScroll = () => {
      if (scrollContainerRef.current && movies.length > 0) {
        scrollIntervalRef.current = setInterval(() => {
          const container = scrollContainerRef.current;
          if (container) {
            const scrollAmount = 300; // Pixels to scroll each time
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            if (container.scrollLeft >= maxScroll) {
              // Reset to beginning when reached the end
              container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              // Scroll to the right
              container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
          }
        }, 5000); // 5 seconds interval
      }
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    // Start auto-scroll when movies are loaded
    if (movies.length > 0) {
      startAutoScroll();
    }

    // Cleanup on unmount
    return () => {
      stopAutoScroll();
    };
  }, [movies]);

  // Handle mouse enter/leave to pause/resume auto-scroll
  const handleMouseEnter = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (movies.length > 0 && !scrollIntervalRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const scrollAmount = 300;
          const maxScroll = container.scrollWidth - container.clientWidth;
          
          if (container.scrollLeft >= maxScroll) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 5000);
    }
  };

  const handlePosterClick = (movie) => {
    // Determine if it's a movie or TV show based on available properties
    const type = movie.title ? 'movie' : 'tv';
    navigate(`/detail/${type}/${movie.id}`);
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div 
        className="row__posters"
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {movies.map((movie) => {
          const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
          
          // Only render if we have a valid image path
          if (!imagePath) return null;
          
          return (
            <div key={movie.id} className="row__posterContainer">
              <img
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${imagePath}`}
                alt={movie.name || movie.title || 'Movie poster'}
                onClick={() => handlePosterClick(movie)}
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
              {onAddToMyList && onRemoveFromMyList && isInMyList && (
                <div className="row__posterOverlay">
                  <button
                    className={`row__myListBtn ${isInMyList(movie.id) ? 'inList' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      isInMyList(movie.id) ? onRemoveFromMyList(movie.id) : onAddToMyList(movie);
                    }}
                  >
                    {isInMyList(movie.id) ? '✓' : '+'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Row;