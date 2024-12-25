//** Page displaying a list of surfboards. Clicking on any surfboard navigates to its detail page **//

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/SurfboardsPage.css';

const SurfboardsPage = () => {
  //** Local state for storing the surfboards and handling errors **//
  const [surfboards, setSurfboards] = useState([]);
  const [error, setError] = useState(null);

  //** React Router hook for navigation **//
  const navigate = useNavigate();

  //** Fetch surfboard data on component mount **//
  useEffect(() => {
    const fetchSurfboards = async () => {
      try {
        const response = await axios.get('/api/surfboards');
        setSurfboards(response.data);
      } catch (err) {
        console.error('Error fetching surfboards:', err.message);
        setError('Failed to load surfboards.');
      }
    };
    fetchSurfboards();
  }, []);

  //** Render a list of surfboards or error/loading messages **//
  return (
    <div className="surfboard-page">
      <div className="surfboard-list">
        {error ? (
          <p className="error-message">{error}</p>
        ) : surfboards.length === 0 ? (
          <p className="loading-message">Loading surfboards...</p>
        ) : (
          surfboards.map((board) => (
            <div
              key={board.sku}
              className="surfboard-card"
              onClick={() => navigate(`/surfboards/${board.sku}`)}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/surfboards/${board.sku}`);
              }}
            >
              <img
                src={board.image}
                alt={`${board.brand} ${board.model}`}
                className="surfboard-card-image"
              />
              <h2 className="surfboard-name">{`${board.brand} - ${board.model}`}</h2>
              <div className="divider"></div>
              <p className="surfboard-sizes">Sizes: {board.sizes.join(', ')}</p>
              <p className="price">${board.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SurfboardsPage;
