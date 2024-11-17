import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCart } from '../../context/CartContext';
import '../../styles/CartScreen.css'; // Import the updated CSS

const CartScreen = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();  // Initialize the navigation hook

  const handleRemove = (sku, size) => {
    removeFromCart(sku, size);
  };

  if (cart.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');  // Navigate to the Checkout page
  };

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Your Shopping Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={`${item.sku}-${item.size}`} className="cart-item">
            <div className="cart-item-details">
              <img src={item.image} alt={item.model} className="cart-item-image" />
              <div className="cart-item-info">
                <h4 className="cart-item-name">{item.model} - {item.size}</h4>
                <p className="cart-item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                <p className="cart-item-total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
            <button className="cart-remove-btn" onClick={() => handleRemove(item.sku, item.size)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3 className="cart-total">Total Price: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button> {/* Checkout button */}
      </div>
    </div>
  );
};

export default CartScreen;
