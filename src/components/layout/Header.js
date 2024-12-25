//** Header component for the web application **//

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Header.css';

//** Define and export the Header component **//
const Header = () => {
  //** Access user details, logout function, and admin status from AuthContext **//
  const { user, logout, isAdmin } = useAuth(); 

  //** Local state for handling search UI and search results **//
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [searchResults, setSearchResults] = useState([]);

  //** React router hook for navigation **//
  const navigate = useNavigate();

  //** Toggle the visibility of the search dropdown **//
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  //** Handle user sign-out, then redirect to home page **//
  const handleSignOut = async () => {
    try {
      await logout(); 
      navigate('/');
    } catch (error) {
      console.error('[ERROR] Error during sign-out:', error.message);
    }
  };

  //** Redirect to cart if user is logged in, else to login **//
  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  //** Debounce search term changes to limit API calls **//
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  //** Fetch search results when debounced search term changes **//
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm.length > 2) {
        try {
          const response = await axios.get(
            `/api/surfboards/search?q=${encodeURIComponent(debouncedSearchTerm)}`
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  //** Update searchTerm state on input change **//
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setSearchTerm(searchQuery);
  };

  //** Handle search result click: navigate to surfboard details, reset search **//
  const handleSearchResultClick = (surfboardSku) => {
    setSearchOpen(false);
    navigate(`/surfboards/${surfboardSku}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  //** Render the navbar **//
  return (
    <nav className="navbar">
      {/* Left side: Home icon */}
      <div className="nav-left">
        <a href="/" className="home-icon">
          <img src={require('../../assets/images/home.png')} alt="Home" />
        </a>
      </div>

      {/* Center links */}
      <div className="nav-links">
        <a href="/surfboards" className="nav-link">SURFBOARDS</a>
        <a href="/surf-recommendation" className="nav-link">FIND A SPOT</a>
        <a href="/live-camera" className="nav-link">LIVE CAMERA</a>
        <a href="/weather" className="nav-link">WEATHER</a>
        <a href="/reviews" className="nav-link">REVIEWS</a>
        {isAdmin && (
          <a href="/admin" className="nav-link admin-link">ADMIN</a>
        )}
      </div>

      {/* Right side actions: cart, auth links, search icon */}
      <div className="nav-actions">
        <button className="cart-btn" onClick={handleCartClick}>Cart</button>
        <div className="auth-links">
          {user ? (
            <>
              <button className="cart-btn" onClick={handleSignOut}>Sign Out</button>
              <span className="welcome-text">Welcome, {user.username}</span>
            </>
          ) : (
            <button className="cart-btn">
              <a href="/login" className="login-btn-link">Login</a>
            </button>
          )}
        </div>

        {/* Search icon toggles search dropdown */}
        <div className="search-icon" onClick={toggleSearch}>
          <img src={require('../../assets/images/search.png')} alt="Search" />
        </div>
      </div>

      {/* Conditional search dropdown */}
      {searchOpen && (
        <div className="search-dropdown">
          <input
            type="text"
            className="search-input"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="search-close" onClick={toggleSearch}>✕</button>

          {/* Display search results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map((surfboard) => (
                  <li key={surfboard.sku} className="search-result-item">
                    <div
                      className="search-result-link"
                      onClick={() => handleSearchResultClick(surfboard.sku)}
                      role="button"
                      tabIndex="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSearchResultClick(surfboard.sku);
                      }}
                    >
                      <div className="search-result-image">
                        <img 
                          src={surfboard.image} 
                          alt={`${surfboard.brand} ${surfboard.model}`} 
                        />
                      </div>
                      <div className="search-result-details">
                        <span className="search-result-name">
                          {`${surfboard.brand} ${surfboard.model}`}
                        </span>
                        <span className="search-result-sku">
                          SKU: {surfboard.sku}
                        </span>
                        <span className="search-result-description">
                          {surfboard.description}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* No results display */}
          {debouncedSearchTerm.length > 2 && searchResults.length === 0 && (
            <div className="no-results">
              <p>No surfboards match your search.</p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
