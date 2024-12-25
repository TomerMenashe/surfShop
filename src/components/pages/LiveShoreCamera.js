//** Component for displaying live camera feeds of shore locations **//

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/LiveShoreCamera.css';

const LiveShoreCamera = () => {
  //** State to store live camera feeds, errors, and loading status **//
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  //** Fetch camera feeds on component mount **//
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        //** Make API call to retrieve camera feeds **//
        const response = await axios.get('/api/cameras/feeds');
        setFeeds(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load live shore cameras. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  //** Render the live shore camera feeds **//
  return (
    <div className="live-shore-container">
      <h1>Live Shore Cameras</h1>
      {loading && <div className="loading">Loading live cameras...</div>}
      {error && <div className="error">{error}</div>}

      {/* Grid layout for camera feeds */}
      <div className="camera-grid">
        {feeds.map((feed, index) => (
          <div key={index} className="camera-item">
            <h3>{feed.location}</h3>
            <iframe
              title={`Live feed from ${feed.location}`}
              src={feed.url.replace('watch?v=', 'embed/')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveShoreCamera;
