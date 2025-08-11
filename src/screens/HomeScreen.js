import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';
import Nav from '../components/Nav';
import Banner from '../components/Banner';
import Row from '../components/Row';
import requests from '../requests';
import axios from '../axios';

function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [myList, setMyList] = useState([]);
  const [showMyList, setShowMyList] = useState(false);
  const navigate = useNavigate();

  const base_url = "https://image.tmdb.org/t/p/original/";

  // Load My List from localStorage on component mount
  useEffect(() => {
    const savedMyList = localStorage.getItem('netflixMyList');
    if (savedMyList) {
      setMyList(JSON.parse(savedMyList));
    }
  }, []);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleMyListClick = () => {
    setShowMyList(!showMyList);
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleHomeClick = () => {
    setShowMyList(false);
    setIsSearching(false);
    setSearchResults([]);
    setSelectedCategory('all');
    navigate('/');
  };

  const addToMyList = (movie) => {
    const updatedList = [...myList, movie];
    setMyList(updatedList);
    localStorage.setItem('netflixMyList', JSON.stringify(updatedList));
  };

  const removeFromMyList = (movieId) => {
    const updatedList = myList.filter(movie => movie.id !== movieId);
    setMyList(updatedList);
    localStorage.setItem('netflixMyList', JSON.stringify(updatedList));
  };

  const handleMovieClick = (movie) => {
    // Determine if it's a movie or TV show based on available properties
    const type = movie.title ? 'movie' : 'tv';
    navigate(`/detail/${type}/${movie.id}`);
  };

  const isInMyList = (movieId) => {
    return myList.some(movie => movie.id === movieId);
  };

  const renderSearchResults = () => {
    if (!isSearching) return null;

    return (
      <div className="searchResults">
        <h2>Search Results</h2>
        <div className="searchResults__grid">
          {searchResults.map((item) => {
            const imagePath = item.poster_path || item.backdrop_path;
            if (!imagePath) return null;

            return (
                <div key={item.id} className="searchResults__item">
                  <img
                    src={`${base_url}${imagePath}`}
                    alt={item.title || item.name}
                    className="searchResults__poster"
                    onClick={() => handleMovieClick(item)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="searchResults__info">
                    <h3>{item.title || item.name}</h3>
                    <p>{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
                    <button
                      className={`myListBtn ${isInMyList(item.id) ? 'inList' : ''}`}
                      onClick={() => isInMyList(item.id) ? removeFromMyList(item.id) : addToMyList(item)}
                    >
                      {isInMyList(item.id) ? '✓ In My List' : '+ My List'}
                    </button>
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    );
  };

  const renderMyList = () => {
    if (!showMyList) return null;

    return (
      <div className="myListSection">
        <h2>My List ({myList.length} items)</h2>
        {myList.length === 0 ? (
          <p className="emptyList">Your list is empty. Add movies and TV shows to see them here!</p>
        ) : (
          <div className="myList__grid">
            {myList.map((item) => {
              const imagePath = item.poster_path || item.backdrop_path;
              if (!imagePath) return null;

              return (
                <div key={item.id} className="myList__item">
                  <img
                    src={`${base_url}${imagePath}`}
                    alt={item.title || item.name}
                    className="myList__poster"
                    onClick={() => handleMovieClick(item)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="myList__info">
                    <h3>{item.title || item.name}</h3>
                    <p>{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
                    <button
                      className="removeBtn"
                      onClick={() => removeFromMyList(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case 'movies':
        return (
          <>
            <Row 
              title="Top Rated Movies" 
              fetchUrl={requests.fetchTopRatedMovies}
              isLargeRow 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Popular Movies" 
              fetchUrl={requests.fetchPopularMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Action Movies" 
              fetchUrl={requests.fetchActionMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Comedy Movies" 
              fetchUrl={requests.fetchComedyMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Horror Movies" 
              fetchUrl={requests.fetchHorrorMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Romance Movies" 
              fetchUrl={requests.fetchRomanceMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Sci-Fi Movies" 
              fetchUrl={requests.fetchSciFiMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Thriller Movies" 
              fetchUrl={requests.fetchThrillerMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Documentaries" 
              fetchUrl={requests.fetchDocumentaries} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
          </>
        );
      case 'tvshows':
        return (
          <>
            <Row 
              title="NETFLIX ORIGINALS" 
              fetchUrl={requests.fetchNetflixOriginals}
              isLargeRow 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Top Rated TV Shows" 
              fetchUrl={requests.fetchTopRatedTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Popular TV Shows" 
              fetchUrl={requests.fetchPopularTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Action TV Shows" 
              fetchUrl={requests.fetchActionTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Comedy TV Shows" 
              fetchUrl={requests.fetchComedyTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Drama TV Shows" 
              fetchUrl={requests.fetchDramaTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Sci-Fi TV Shows" 
              fetchUrl={requests.fetchSciFiTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Crime TV Shows" 
              fetchUrl={requests.fetchCrimeTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Documentary TV Shows" 
              fetchUrl={requests.fetchDocumentaryTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Animation TV Shows" 
              fetchUrl={requests.fetchAnimationTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
          </>
        );
      default:
        return (
          <>
            <Row 
              title="NETFLIX ORIGINALS" 
              fetchUrl={requests.fetchNetflixOriginals}
              isLargeRow 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Trending Now" 
              fetchUrl={requests.fetchTrending} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Top Rated Movies" 
              fetchUrl={requests.fetchTopRatedMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Popular Movies" 
              fetchUrl={requests.fetchPopularMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Action Movies" 
              fetchUrl={requests.fetchActionMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Comedy Movies" 
              fetchUrl={requests.fetchComedyMovies} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Popular TV Shows" 
              fetchUrl={requests.fetchPopularTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
            <Row 
              title="Drama TV Shows" 
              fetchUrl={requests.fetchDramaTVShows} 
              onAddToMyList={addToMyList}
              onRemoveFromMyList={removeFromMyList}
              isInMyList={isInMyList}
            />
          </>
        );
    }
  };

  return (
    <div className="homeScreen">
      <Nav 
        onSearch={handleSearch}
        onMyListClick={handleMyListClick}
        onHomeClick={handleHomeClick}
      />
      
      {!isSearching && !showMyList && <Banner />}
      
      {renderSearchResults()}
      {renderMyList()}
      
      {!isSearching && !showMyList && (
        <>
          <div className="homeScreen__categories">
            <button 
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              className={selectedCategory === 'movies' ? 'active' : ''}
              onClick={() => setSelectedCategory('movies')}
            >
              Movies
            </button>
            <button 
              className={selectedCategory === 'tv' ? 'active' : ''}
              onClick={() => setSelectedCategory('tv')}
            >
              TV Shows
            </button>
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
}

export default HomeScreen;