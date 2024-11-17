import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/CheckoutScreen.css';

const CheckoutScreen = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = () => {
    // Clear the cart after payment
    clearCart();
    // Redirect to the Thank You page
    navigate('/thank-you');
  };

  if (cart.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-heading">Checkout</h2>
      <ul className="checkout-list">
        {cart.map((item) => (
          <li key={`${item.sku}-${item.size}`} className="checkout-item">
            <div className="checkout-item-details">
              <img src={item.image} alt={item.model} className="checkout-item-image" />
              <div className="checkout-item-info">
                <h4 className="checkout-item-name">{item.model} - {item.size}</h4>
                <p className="checkout-item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                <p className="checkout-item-total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="checkout-summary">
        <h3 className="checkout-total">Total Price: ${totalPrice.toFixed(2)}</h3>
        <button className="pay-btn" onClick={handlePayment}>Pay Now</button>
      </div>
    </div>
  );
};

export default CheckoutScreen;
