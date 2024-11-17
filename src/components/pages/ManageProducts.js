import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import '../../styles/ManageProducts.css'; // Ensure this path matches your project structure

const ManageProducts = ({ products, fetchProducts, productsLoading, productsError }) => {
  const [newProduct, setNewProduct] = useState({
    brand: '',
    model: '',
    length: '',
    price: '',
    image: '',
    description: '',
    sku: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddProduct = async () => {
    try {
      setErrorMessage(''); // Clear any previous errors
      await axios.post('/api/surfboards', newProduct, {
        headers: { 'Content-Type': 'application/json' },
      });
      setNewProduct({
        brand: '',
        model: '',
        length: '',
        price: '',
        image: '',
        description: '',
        sku: '',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || 'Failed to add product. Please try again.'
      );
    }
  };

  const handleRemoveProduct = async (sku) => {
    try {
      setErrorMessage(''); // Clear any previous errors
      await axios.delete(`/api/surfboards/${sku}`);
      fetchProducts();
    } catch (error) {
      console.error('Error removing product:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || 'Failed to remove product. Please try again.'
      );
    }
  };

  if (productsLoading) return <p>Loading products...</p>;
  if (productsError) return <p className="error-message">{productsError}</p>;

  return (
    <div className="manage-products-container">
      <h2>Manage Products</h2>

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Add Product Form */}
      <div className="add-product-form">
        <input
          type="text"
          placeholder="Brand"
          value={newProduct.brand}
          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Model"
          value={newProduct.model}
          onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
        />
        <input
          type="number"
          placeholder="Length"
          value={newProduct.length}
          onChange={(e) => setNewProduct({ ...newProduct, length: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="SKU"
          value={newProduct.sku}
          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Product List */}
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.sku}>
            <img src={product.image} alt={product.model} />
            <h3>{product.model}</h3>
            <p>{product.description}</p>
            <button onClick={() => handleRemoveProduct(product.sku)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
