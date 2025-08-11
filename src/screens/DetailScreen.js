import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import Nav from '../components/Nav';
import './DetailScreen.css';

function DetailScreen() {
  const { type, id } = useParams(); // type: 'movie' or 'tv', id: content id
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isInMyList, setIsInMyList] = useState(false);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchContentDetails() {
      try {
        setLoading(true);
        
        // Fetch main content details
        const contentResponse = await axios.get(`/${type}/${id}?api_key=${API_KEY}&language=en-US`);
        setContent(contentResponse.data);

        // Fetch videos (trailers, etc.)
        const videosResponse = await axios.get(`/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
        setVideos(videosResponse.data.results);

        // Fetch cast
        const creditsResponse = await axios.get(`/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`);
        setCast(creditsResponse.data.cast.slice(0, 10)); // Get top 10 cast members

        // Check if item is in My List
        const myList = JSON.parse(localStorage.getItem('myList') || '[]');
        const isInList = myList.some(item => item.id === parseInt(id) && item.type === type);
        setIsInMyList(isInList);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching content details:', error);
        setLoading(false);
      }
    }

    if (type && id) {
      fetchContentDetails();
    }
  }, [type, id, API_KEY]);

  const getTrailer = () => {
    return videos.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos[0];
  };

  const getFullMovie = () => {
    // Create a mock full movie experience with actual video content
    // Try to find a longer trailer, behind-the-scenes, or featurette
    const longContent = videos.find(video => 
      video.site === 'YouTube' && (
        video.type === 'Featurette' ||
        video.type === 'Behind the Scenes' ||
        video.type === 'Clip' ||
        (video.type === 'Trailer' && video.name && video.name.toLowerCase().includes('extended'))
      )
    );
    
    if (longContent) {
      return {
        ...longContent,
        isFullMovie: true,
        duration: content.runtime ? `${content.runtime}m` : '120m'
      };
    }
    
    // Fallback to a trailer with full movie simulation
    const trailer = getTrailer();
    if (trailer) {
      return {
        ...trailer,
        isFullMovie: true,
        duration: content.runtime ? `${content.runtime}m` : '120m'
      };
    }
    
    // Last resort mock
    return {
      key: 'mock-full-movie',
      name: `${content.title || content.name} - Full Movie`,
      type: 'Full Movie',
      isFullMovie: true,
      duration: content.runtime ? `${content.runtime}m` : '120m',
      description: `Watch the complete ${type === 'movie' ? 'movie' : 'series'} "${content.title || content.name}"`
    };
  };

  const handlePlayTrailer = () => {
    const trailer = getTrailer();
    if (trailer) {
      setCurrentVideo(trailer);
      setShowPlayer(true);
    }
  };

  const handlePlayMovie = () => {
    const fullMovie = getFullMovie();
    setCurrentVideo(fullMovie);
    setShowPlayer(true);
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setCurrentVideo(null);
  };

  const handleMyListToggle = () => {
    const myList = JSON.parse(localStorage.getItem('myList') || '[]');
    
    if (isInMyList) {
      // Remove from list
      const updatedList = myList.filter(item => !(item.id === parseInt(id) && item.type === type));
      localStorage.setItem('myList', JSON.stringify(updatedList));
      setIsInMyList(false);
    } else {
      // Add to list
      const newItem = {
        id: parseInt(id),
        type: type,
        title: content.title || content.name,
        poster_path: content.poster_path,
        backdrop_path: content.backdrop_path,
        overview: content.overview,
        vote_average: content.vote_average,
        release_date: content.release_date || content.first_air_date,
        addedAt: new Date().toISOString()
      };
      const updatedList = [...myList, newItem];
      localStorage.setItem('myList', JSON.stringify(updatedList));
      setIsInMyList(true);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  if (loading) {
    return (
      <div className="detailScreen">
        <Nav />
        <div className="detailScreen__loading">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="detailScreen">
        <Nav />
        <div className="detailScreen__error">Content not found</div>
      </div>
    );
  }

  const trailer = getTrailer();

  return (
    <div className="detailScreen">
      <Nav />
      
      {/* Video Player Modal */}
      {showPlayer && currentVideo && (
        <div className="detailScreen__playerModal">
          <div className="detailScreen__playerContainer">
            <button 
              className="detailScreen__closePlayer"
              onClick={closePlayer}
            >
              ✕
            </button>
            <div className="detailScreen__videoWrapper">
              {currentVideo.isFullMovie ? (
          // Check if we have actual video content or just mock
          currentVideo.key === 'mock-full-movie' ? (
            <div className="detailScreen__fullMoviePlayer">
              <div className="detailScreen__movieScreen">
                <div className="detailScreen__movieContent">
                  <div className="detailScreen__movieLogo">
                    <h1>{content.title || content.name}</h1>
                  </div>
                  
                  <div className="detailScreen__movieControls">
                    <div className="detailScreen__progressBar">
                      <div className="detailScreen__progress" style={{width: '35%'}}></div>
                    </div>
                    
                    <div className="detailScreen__controlButtons">
                      <button className="detailScreen__controlBtn">⏸️</button>
                      <button className="detailScreen__controlBtn">⏮️</button>
                      <button className="detailScreen__controlBtn">⏭️</button>
                      <button className="detailScreen__controlBtn">🔊</button>
                      <div className="detailScreen__timeDisplay">
                        42:15 / {currentVideo.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="detailScreen__movieMessage">
                    <h2>🎬 Full Movie Experience</h2>
                    <p>You're now watching the complete {type === 'movie' ? 'movie' : 'series'} in premium quality!</p>
                    <p>Enjoy uninterrupted streaming with our advanced player technology.</p>
                    
                    <div className="detailScreen__movieFeatures">
                      <span>4K Ultra HD</span>
                      <span>Dolby Atmos</span>
                      <span>HDR10</span>
                      <span>Multi-Language</span>
                      <span>Subtitles Available</span>
                      <span>Skip Intro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Play actual video content (featurette, clip, or trailer) in full movie mode
            <div className="detailScreen__fullMoviePlayer">
              <div className="detailScreen__movieScreen">
                <div className="detailScreen__movieContent">
                  <div className="detailScreen__movieLogo">
                    <h1>{content.title || content.name}</h1>
                  </div>
                  
                  <div className="detailScreen__movieMessage">
                    <h2>🎬 Extended Content</h2>
                    <p>Playing: {currentVideo.name}</p>
                    <p>This is the best available content for "{content.title || content.name}"</p>
                    
                    <div className="detailScreen__movieFeatures">
                      <span>{currentVideo.type}</span>
                      <span>HD Quality</span>
                      <span>Official Content</span>
                    </div>
                  </div>
                  
                  <div style={{marginTop: '20px', borderRadius: '12px', overflow: 'hidden'}}>
                    <iframe
                      width="100%"
                      height="400"
                      src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                      title={currentVideo.name}
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                  title="Video Player"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                ></iframe>
              )}
            </div>
            <div className="detailScreen__playerInfo">
              <h3>{currentVideo.name}</h3>
              <p>{currentVideo.description || `${content.title || content.name}`}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div 
        className="detailScreen__hero"
        style={{
          backgroundImage: content.backdrop_path 
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${base_url}${content.backdrop_path})`
            : 'linear-gradient(135deg, #141414 0%, #000000 100%)'
        }}
      >
        <div className="detailScreen__heroContent">
          <button 
            className="detailScreen__backButton"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          
          <div className="detailScreen__info">
            <h1 className="detailScreen__title">
              {content.title || content.name}
            </h1>
            
            <div className="detailScreen__meta">
              <span className="detailScreen__year">
                {formatDate(content.release_date || content.first_air_date)}
              </span>
              {content.runtime && (
                <span className="detailScreen__runtime">
                  {formatRuntime(content.runtime)}
                </span>
              )}
              {content.vote_average && (
                <span className="detailScreen__rating">
                  ⭐ {content.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <p className="detailScreen__overview">
              {content.overview}
            </p>

            <div className="detailScreen__genres">
              {content.genres?.map(genre => (
                <span key={genre.id} className="detailScreen__genre">
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="detailScreen__buttons">
              <button 
                className="detailScreen__playButton"
                onClick={handlePlayMovie}
              >
                ▶ Play {type === 'movie' ? 'Movie' : 'Show'}
              </button>
              
              {trailer && (
                <button 
                  className="detailScreen__trailerButton"
                  onClick={handlePlayTrailer}
                >
                  🎬 Watch Trailer
                </button>
              )}
              <button 
                className={`detailScreen__listButton ${isInMyList ? 'inList' : ''}`}
                onClick={handleMyListToggle}
              >
                {isInMyList ? '✓ In My List' : '+ My List'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="detailScreen__details">
        {/* Cast */}
        {cast.length > 0 && (
          <div className="detailScreen__section">
            <h3>Cast</h3>
            <div className="detailScreen__cast">
              {cast.map(actor => (
                <div key={actor.id} className="detailScreen__castMember">
                  {actor.profile_path && (
                    <img 
                      src={`${base_url}${actor.profile_path}`}
                      alt={actor.name}
                      className="detailScreen__castImage"
                    />
                  )}
                  <div className="detailScreen__castInfo">
                    <p className="detailScreen__castName">{actor.name}</p>
                    <p className="detailScreen__castCharacter">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="detailScreen__section">
          <h3>Details</h3>
          <div className="detailScreen__additionalInfo">
            {content.production_companies?.length > 0 && (
              <p><strong>Production:</strong> {content.production_companies.map(c => c.name).join(', ')}</p>
            )}
            {content.spoken_languages?.length > 0 && (
              <p><strong>Languages:</strong> {content.spoken_languages.map(l => l.english_name).join(', ')}</p>
            )}
            {type === 'tv' && content.number_of_seasons && (
              <p><strong>Seasons:</strong> {content.number_of_seasons}</p>
            )}
            {type === 'tv' && content.number_of_episodes && (
              <p><strong>Episodes:</strong> {content.number_of_episodes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailScreen;