import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css';
import PageWrapper from './PageWrapper'; // Import the PageWrapper component

const HomePage = () => {
  return (
    <PageWrapper>
      <div className="homepage-container">
        {/* Hero Section with Video */}
        <div className="hero-section">
          <video className="background-video" autoPlay loop muted>
            <source src={require('../../assets/images/surfingvideo.mov')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-text-container">
            <h1 className="hero-text">
              Discover the ultimate selection of surfboards
            </h1>
            <Link to="/surfboards">
              <button className="shop-now-btn">Shop Now</button>
            </Link>
          </div>
        </div>

        {/* Category Section */}
        <div className="category-grid">
          {/* Fins */}
          <div className="category-item">
            <img
              src={require('../../assets/images/fins.jpg')}
              alt="Fins"
              className="category-image"
            />
            <Link to="/fins" className="category-link">
              <div className="overlay-text">FINS</div>
            </Link>
          </div>

          {/* Accessories */}
          <div className="category-item">
            <img
              src={require('../../assets/images/accessories.jpg')}
              alt="Accessories"
              className="category-image"
            />
            <Link to="/accessories" className="category-link">
              <div className="overlay-text">ACCESSORIES</div>
            </Link>
          </div>

          {/* Apparel */}
          <div className="category-item">
            <img
              src={require('../../assets/images/apparel.jpg')}
              alt="Apparel"
              className="category-image"
            />
            <Link to="/apparel" className="category-link">
              <div className="overlay-text">APPAREL</div>
            </Link>
          </div>

          {/* Technology */}
          <div className="category-item">
            <img
              src={require('../../assets/images/technology.jpg')}
              alt="Technology"
              className="category-image"
            />
            <Link to="/technology" className="category-link">
              <div className="overlay-text">TECHNOLOGY</div>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
