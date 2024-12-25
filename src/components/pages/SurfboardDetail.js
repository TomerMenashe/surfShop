//** Displays detailed information about a specific surfboard, with the option to add it to the cart **//

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/SurfboardsPage.css'; // Existing styles
import '../../styles/SurfboardDetail.css'; // Updated CSS code above

const SurfboardDetail = () => {
  //** Extract the SKU from the URL parameters **//
  const { sku } = useParams();

  //** For navigation upon adding to cart or if user is not logged in **//
  const navigate = useNavigate();

  //** Retrieve user data from the AuthContext **//
  const { user } = useAuth();

  //** Local state to store surfboard details, the selected size, and messages **//
  const [surfboard, setSurfboard] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [message, setMessage] = useState('');

  //** Fetch surfboard details on component mount or SKU change **//
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/surfboards/${sku}`);
        setSurfboard(response.data);
        setSelectedSize(response.data.sizes[0]); //** Default to the first available size **//
      } catch (err) {
        console.error('Error fetching surfboard details:', err.message);
        setMessage('Failed to load surfboard details.');
      }
    };
    fetchDetails();
  }, [sku]);

  //** Handle adding the surfboard to the user's cart **//
  const handleAddToCart = async () => {
    //** Redirect to login if user is not authenticated **//
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        '/api/cart/add',
        { sku: surfboard.sku, size: selectedSize, quantity: 1 },
        { withCredentials: true }
      );
      setMessage('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err.message);
      setMessage('Failed to add to cart.');
    }
  };

  //** Handle navigating to review section for this board **//
  const handleViewReviews = () => {
    // Navigate to the reviews page with the SKU as a query parameter
    navigate(`/reviews?sku=${surfboard.sku}`);
  };

  //** Show a loading message until surfboard data is retrieved **//
  if (!surfboard) {
    return <p className="loading-message">Loading...</p>;
  }

  //** Render detailed information about the surfboard **//
  return (
    <div className="surfboard-detail-page">
      <div className="surfboard-detail-card">
        {/* Surfboard Image */}
        <img
          src={surfboard.image}
          alt={`${surfboard.brand} ${surfboard.model}`}
          className="surfboard-detail-image"
        />

        {/* Surfboard Info */}
        <div className="surfboard-detail-info">
          <h2 className="surfboard-name">
            {`${surfboard.brand} - ${surfboard.model}`}
          </h2>
          <div className="divider"></div>
          <p className="price">${surfboard.price}</p>
          <p className="surfboard-description">{surfboard.description}</p>

          {/* Size Selection */}
          <label htmlFor="size" className="size-label">
            Choose Size:
          </label>
          <select
            id="size"
            className="size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {surfboard.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="button-group">
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleViewReviews}>View Reviews</button>
          </div>

          {/* Success/Error Message */}
          {message && <p className="action-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SurfboardDetail;
