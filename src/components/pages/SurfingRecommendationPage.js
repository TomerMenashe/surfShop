//** Page allowing users to find recommended surf spots based on experience and location **//

import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/SurfingRecommendationPage.css';

const SurfingRecommendationPage = () => {
  //** Local state to handle user input, recommendation display, and loading/error states **//
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //** Prepare an array of possible surfing experience years **//
  const yearsOfExperience = Array.from({ length: 50 }, (_, i) => i + 1);

  //** Handle form submission to request a surf spot recommendation **//
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    //** Validate required fields **//
    if (!experience || !location) {
      setError('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      //** Make POST request to AI endpoint **//
      const response = await axios.post('/api/ai/recommend-surf-spot', { experience, location });
      setRecommendation(response.data.recommendation);
    } catch (err) {
      setError('Error generating recommendation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  //** Render the SurfingRecommendationPage **//
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Surf Spot Finder</h2>
        {error && <div className="error">{error}</div>}
        
        {/* Surfing experience dropdown */}
        <div className="form-group">
          <label htmlFor="experience">Years of Surfing Experience</label>
          <select
            id="experience"
            className="dropdown"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">Select your experience</option>
            {yearsOfExperience.map((year) => (
              <option key={year} value={year}>
                {year} year{year > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        
        {/* User location input */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter your current location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {/* Submit button */}
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Finding Spot...' : 'Find My Spot'}
        </button>
        
        {/* Recommendation display */}
        {recommendation && (
          <div className="recommendation-display">
            <h3>Recommended Surf Spot</h3>
            <div className="recommendation-content">
              {recommendation.split('\n').map((line, index) => {
                //** Header formatting (example lines starting with '- **') **//
                if (line.startsWith('- **')) {
                  return (
                    <p key={index} className="recommendation-header">
                      {line.replace('- ', '')}
                    </p>
                  );
                }
                //** Numbered list items **//
                if (/^\d\./.test(line)) {
                  return (
                    <p key={index} className="recommendation-item">
                      {line}
                    </p>
                  );
                }
                return <p key={index}>{line}</p>;
              })}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SurfingRecommendationPage;
