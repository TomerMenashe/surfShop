import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext'; // Import the cart context
import PageWrapper from './PageWrapper'; // Import the PageWrapper component
import '../../styles/SurfboardDetail.css';

const SurfboardDetail = () => {
  const { sku } = useParams();
  const { state } = useLocation();
  const { addToCart } = useCart(); // Use the addToCart function from CartContext
  const [surfboard, setSurfboard] = useState(state?.surfboard || null);
  const [loading, setLoading] = useState(!surfboard);
  const [selectedSize, setSelectedSize] = useState("6'0"); // Default size
  const [cartMessage, setCartMessage] = useState('');

  const sizes = ["5'8", "6'0", "7'0", "7'6"]; // Available sizes

  useEffect(() => {
    if (!surfboard) {
      const fetchSurfboard = async () => {
        try {
          const response = await axios.get(`/api/surfboards/${sku}`);
          setSurfboard(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching surfboard details:', error);
          setLoading(false);
        }
      };
      fetchSurfboard();
    }
  }, [sku, surfboard]);

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleAddToCart = () => {
    // Add the selected surfboard with the selected size to the cart
    const productToAdd = {
      ...surfboard,
      size: selectedSize,
      quantity: 1, // Set the default quantity to 1
    };
    addToCart(productToAdd); // Call the addToCart function from CartContext
    setCartMessage(`Added ${surfboard.model} (${selectedSize}) to the cart!`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!surfboard) {
    return <div>No surfboard data available.</div>;
  }

  return (
    <PageWrapper>
      <div className="surfboard-detail-container">
        <div className="surfboard-detail-card">
          <img
            src={surfboard.image}
            alt={surfboard.model}
            className="surfboard-detail-image"
          />
          <div className="surfboard-detail-info">
            <h2>
              {surfboard.brand} - {surfboard.model}
            </h2>
            <p className="price">
              ${surfboard.price}
              {surfboard.discount && (
                <span className="discounted-price"> ${surfboard.discount}</span>
              )}
            </p>

            {/* Size Selection */}
            <h3 className="subheading">Choose Size:</h3>
            <select
              value={selectedSize}
              onChange={handleSizeChange}
              className="size-select"
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* Add to Cart Button */}
            <div className="button-group">
              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>

            {/* Display cart message */}
            {cartMessage && <p className="cart-message">{cartMessage}</p>}

            <h3 className="subheading">Model Overview</h3>
            <p className="description">{surfboard.description}</p>
            {surfboard.conditions && (
              <>
                <h3 className="subheading">Conditions</h3>
                <p className="description">{surfboard.conditions}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SurfboardDetail;
