//** Cart screen component that displays the user's cart and allows for item quantity updates and removal **//

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/CartScreen.css';

const CartScreen = () => {
  //** State variables for cart items, selected items, total cost, error messages, and loading status **//
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  //** React Router hook for navigation **//
  const navigate = useNavigate();

  //** Hard-coded username for demonstration purposes **//
  const username = 'admin';

  //** Fetch cart items on component mount **//
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/cart', { params: { username } });
        setCart(response.data);
        calculateTotal(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err.message);
        setError('Failed to load your cart.');
        setLoading(false);
      }
    };
    fetchCart();
  }, [username]);

  //** Calculate total cost of the cart **//
  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce((acc, item) => {
      if (item.price && item.quantity) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotal(totalPrice.toFixed(2));
  };

  //** Remove a specific item from the cart **//
  const handleRemove = async (sku, size) => {
    const confirmRemoval = window.confirm('Are you sure you want to remove this item from your cart?');
    if (!confirmRemoval) return;

    try {
      const response = await axios.post('/api/cart/remove', { sku, size }, { params: { username } });
      setCart(response.data);
      calculateTotal(response.data);
      setSelectedItems((prev) => {
        const updated = { ...prev };
        delete updated[`${sku}-${size}`];
        return updated;
      });
    } catch (err) {
      console.error('Error removing item:', err.message);
      setError('Failed to remove item from cart.');
    }
  };

  //** Update item quantity and recalculate totals **//
  const handleQuantityChange = async (sku, size, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      alert('Quantity must be a non-negative number.');
      return;
    }

    try {
      //** If quantity is zero, remove the item **//
      if (parsedQuantity === 0) {
        await handleRemove(sku, size);
      } else {
        const response = await axios.post(
          '/api/cart/update',
          { sku, size, quantity: parsedQuantity },
          { params: { username } }
        );
        setCart(response.data);
        calculateTotal(response.data);
      }
    } catch (err) {
      console.error('Error updating quantity:', err.message);
      setError('Failed to update item quantity.');
    }
  };

  //** Select or unselect an item for checkout **//
  const handleSelectItem = (sku, size) => {
    const key = `${sku}-${size}`;
    setSelectedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  //** Proceed to checkout with selected items **//
  const handleCheckout = () => {
    const itemsToCheckout = cart.filter((item) => selectedItems[`${item.sku}-${item.size}`]);
    if (itemsToCheckout.length === 0) {
      alert('Please select at least one item to checkout.');
      return;
    }
    navigate('/checkout', { state: { items: itemsToCheckout } });
  };

  //** Display loading state **//
  if (loading) {
    return <div>Loading your cart...</div>;
  }

  //** Display error if any **//
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  //** Display empty cart message if no items **//
  if (cart.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  //** Render the cart contents **//
  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={`${item.sku}-${item.size}`} className="cart-item">
            <input
              type="checkbox"
              checked={!!selectedItems[`${item.sku}-${item.size}`]}
              onChange={() => handleSelectItem(item.sku, item.size)}
              className="cart-item-select"
              aria-label={`Select ${item.model} size ${item.size} for checkout`}
            />
            <img src={item.image} alt={item.model} className="cart-item-image" />
            <div className="cart-item-details">
              <div className="cart-item-info">
                <h3>{item.model || 'Unnamed Surfboard'}</h3>
                <p>Size: {item.size || 'N/A'}</p>
                <p>Price: ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
                <p>
                  Total:{' '}
                  {item.price && item.quantity
                    ? (item.price * item.quantity).toFixed(2)
                    : 'N/A'}
                </p>
              </div>
              <div className="cart-item-actions">
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.sku, item.size, e.target.value)}
                  className="cart-item-quantity"
                  aria-label={`Quantity for ${item.model} size ${item.size}`}
                />
                <button
                  onClick={() => handleRemove(item.sku, item.size)}
                  className="cart-remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3>Total: ${total}</h3>
        <button onClick={handleCheckout} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartScreen;
