//** Component for viewing and adding surfboard reviews **//

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import '../../styles/ReviewSection.css';

const ReviewSection = () => {
  //** Get current user data (e.g., username, ID) from AuthContext **//
  const { user } = useAuth(); 
  const userId = user?.id; 
  const username = user?.username; 

  //** Local state for surfboards list, selected SKU, reviews, rating, comment, and errors/success messages **//
  const [surfboards, setSurfboards] = useState([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(false);

  //** Fetch surfboard data from the server **//
  const fetchSurfboards = async () => {
    try {
      const response = await axios.get('/api/surfboards');
      setSurfboards(response.data);
    } catch (error) {
      console.error('[ERROR] Fetching surfboards failed:', error.message);
    }
  };

  //** Fetch reviews for the selected surfboard **//
  const fetchReviews = useCallback(async () => {
    if (!selectedSku) return;
    setLoadingReviews(true);
    try {
      const response = await axios.get(`/api/reviews/${selectedSku}`);
      setReviews(response.data);
    } catch (error) {
      console.error('[ERROR] Fetching reviews failed:', error.message);
    } finally {
      setLoadingReviews(false);
    }
  }, [selectedSku]);

  //** Submit a new review **//
  const submitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    //** Validate fields: must have SKU, rating between 1-5, and comment **//
    if (!selectedSku || rating < 1 || rating > 5 || !comment) {
      setError('Please select a surfboard, provide a valid rating, and write a comment.');
      return;
    }

    try {
      await axios.post('/api/reviews/add', {
        sku: selectedSku,
        userId,
        username,
        rating,
        comment,
      });
      setSuccess('Review added successfully.');
      setRating(0);
      setComment('');
      fetchReviews(); //** Refresh reviews list after submitting a new one **//
    } catch (error) {
      console.error('[ERROR] Adding review failed:', error.message);
      setError('Failed to add review. Please try again.');
    }
  };

  //** Fetch the surfboards list on component mount **//
  useEffect(() => {
    fetchSurfboards();
  }, []);

  //** Whenever selectedSku changes, fetch the relevant reviews **//
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  //** Render the review section **//
  return (
    <div className="review-section-container">
      <h1>Reviews</h1>

      {/* Surfboard dropdown selection */}
      <div className="surfboard-selection-container">
        <label htmlFor="surfboard-selection" className="surfboard-selection-label">
          Select a Surfboard
        </label>
        <select
          id="surfboard-selection"
          className="surfboard-selection"
          value={selectedSku}
          onChange={(e) => setSelectedSku(e.target.value)}
        >
          <option value="" disabled>
            Choose a surfboard...
          </option>
          {surfboards.map((surfboard) => (
            <option key={surfboard.sku} value={surfboard.sku}>
              {surfboard.brand} - {surfboard.model}
            </option>
          ))}
        </select>
      </div>

      {/* Form for submitting a new review */}
      <form className="review-form" onSubmit={submitReview}>
        <div>
          <label>Rating (1-5):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min="1"
            max="5"
          />
        </div>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={!selectedSku || rating < 1 || rating > 5 || !comment}
        >
          Submit Review
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>

      {/* Display reviews */}
      <div className="reviews-grid">
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p>
                <strong>{review.username}</strong> rated <strong>{review.rating}/5</strong>
              </p>
              <p>{review.comment}</p>
              <p className="review-date">{new Date(review.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
