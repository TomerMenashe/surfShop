//** Checkout screen component allowing the user to finalize their purchase **//

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CheckoutScreen.css';

//** Define and export the CheckoutScreen component **//
const CheckoutScreen = () => {
  //** Use React Router hooks to get checkout items from route state and for navigation **//
  const location = useLocation();
  const navigate = useNavigate();

  //** Destructure items (selectedItems) from the location's state **//
  const { items: selectedItems } = location.state || { items: [] };

  //** If no items are selected, display a message **//
  if (selectedItems.length === 0) {
    return <div className="cart-empty">No items selected for checkout.</div>;
  }

  //** Calculate the total price of all selected items **//
  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  //** Handle the payment process: create a purchase record and remove items from cart **//
  const handlePayment = async () => {
    try {
      //** Create an array of purchase details for the current items **//
      const purchaseData = selectedItems.map(({ sku, size, quantity, price, model }) => ({
        sku,
        size,
        quantity,
        price,
        model,
      }));

      //** Send purchase data to the server **//
      await axios.post('/api/purchases/add', { purchases: purchaseData }, { withCredentials: true });

      //** Construct an array of items to remove from cart after purchase **//
      const itemsToRemove = selectedItems.map(({ sku, size }) => ({ sku, size }));

      //** Remove these items from the cart on the server **//
      await axios.post('/api/cart/remove-multiple', { items: itemsToRemove }, { withCredentials: true });

      //** Redirect to a thank-you screen once completed **//
      navigate('/thank-you', { replace: true });
    } catch (error) {
      console.error('Error processing payment:', error.message);
      alert('Failed to process payment. Please try again.');
    }
  };

  //** Render the checkout items and payment button **//
  return (
    <div className="checkout-container">
      <h2 className="checkout-heading">Checkout</h2>
      <ul className="checkout-list">
        {selectedItems.map((item) => (
          <li key={`${item.sku}-${item.size}`} className="checkout-item">
            <img src={item.image} alt={item.model} className="checkout-item-image" />
            <div className="checkout-item-info">
              <h4 className="checkout-item-name">
                {item.model} - {item.size}
              </h4>
              <p className="checkout-item-price">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
              <p className="checkout-item-total">
                Total: {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="checkout-summary">
        <h3 className="checkout-total">
          Total Price: ${totalPrice.toFixed(2)}
        </h3>
        <button className="pay-btn" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default CheckoutScreen;
