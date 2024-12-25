//** Home page component showcasing a hero video and a grid of navigable categories **//

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css';
import PageWrapper from './PageWrapper'; 

const HomePage = () => {
  return (
    <PageWrapper>
      {/* Hero section with background video */}
      <div className="homepage-container">
        <div className="hero-section">
          <video className="background-video" autoPlay loop muted>
            <source src= 'https://videos.pexels.com/video-files/1093664/1093664-hd_1920_1080_30fps.mp4'/>
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

        {/* Category grid of navigable sections */}
        <div className="category-grid">
          <div className="category-item">
            <img
              src='https://images.pexels.com/photos/1753689/pexels-photo-1753689.jpeg?auto=compress&cs=tinysrgb&w=600'
              alt="surf-recommendation"
              className="category-image"
            />
            <Link to="/surf-recommendation" className="category-link">
              <div className="overlay-text">FIND A SPOT</div>
            </Link>
          </div>

          <div className="category-item">
            <img
              src='https://images.pexels.com/photos/111085/pexels-photo-111085.jpeg?auto=compress&cs=tinysrgb&w=600'
              alt="live-camera"
              className="category-image"
            />
            <Link to="/live-camera" className="category-link">
              <div className="overlay-text">LIVE CAMERA</div>
            </Link>
          </div>

          <div className="category-item">
            <img
              src='https://images.pexels.com/photos/757133/pexels-photo-757133.jpeg?auto=compress&cs=tinysrgb&w=600'
              alt="weather"
              className="category-image"
            />
            <Link to="/weather" className="category-link">
              <div className="overlay-text">WEATHER</div>
            </Link>
          </div>

          <div className="category-item">
            <img
              src='https://images.pexels.com/photos/756086/pexels-photo-756086.jpeg?auto=compress&cs=tinysrgb&w=600'
              alt="reviews"
              className="category-image"
            />
            <Link to="/reviews" className="category-link">
              <div className="overlay-text">reviews</div>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
