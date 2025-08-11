import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';

function Nav({ onSearch, onMyListClick, onHomeClick }) {
  const [show, handleShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm('');
      if (onSearch) {
        onSearch('');
      }
    }
  };

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <img
          onClick={() => onHomeClick ? onHomeClick() : navigate("/")}
          className="nav__logo"
          src="/netflix-logo.svg"
          alt="Netflix Logo"
        />

        <div className="nav__center">
          <div className="nav__links">
            <span onClick={() => onHomeClick ? onHomeClick() : navigate("/")}>Home</span>
            <span onClick={() => onMyListClick && onMyListClick()}>My List</span>
          </div>

          <div className="nav__search">
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="nav__searchForm">
                <input
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="nav__searchInput"
                  autoFocus
                />
                <button type="button" onClick={toggleSearch} className="nav__searchClose">
                  ✕
                </button>
              </form>
            ) : (
              <button onClick={toggleSearch} className="nav__searchIcon">
                🔍
              </button>
            )}
          </div>
        </div>

        <img
          onClick={() => navigate("/profile")}
          className="nav__avatar"
          src="/netflix-avatar.svg"
          alt="User Avatar"
        />
      </div>
    </div>
  );
}

export default Nav;