//** Component for managing product data: add new products and delete existing ones **//

import React, { useState } from 'react';
import '../../styles/ManageProducts.css';

const ManageProducts = ({
  products,
  onAddProduct,
  onRemoveProduct,
  productsLoading,
  productsError,
}) => {
  //** State for the new product form **//
  const [newProduct, setNewProduct] = useState({
    brand: '',
    model: '',
    price: '',
    image: '',
    sku: '',
    sizes: [''],
    description: '',
    dateAdded: new Date().toISOString(), 
  });

  //** Handle changes in the new product form inputs **//
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    //** For sizes, treat them as raw input which will be parsed on the server **//
    if (name === 'sizes') {
      setNewProduct((prev) => ({
        ...prev,
        sizes: value,
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  //** Handle submission of the new product form **//
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data before submit:', newProduct);

    //** Trigger the onAddProduct callback with the new product details **//
    await onAddProduct(newProduct);

    //** Reset form fields after successful submission **//
    setNewProduct({
      brand: '',
      model: '',
      price: '',
      image: '',
      sku: '',
      sizes: [''],
      description: '',
      dateAdded: new Date().toISOString(),
    });
  };

  //** If products are loading or an error occurred, handle it here **//
  if (productsLoading) return <p>Loading products...</p>;
  if (productsError) return <p className="error-message">{productsError}</p>;

  //** Render the form for adding new products and list of existing products **//
  return (
    <div className="manage-products-container">
      <h2>Manage Products</h2>

      {/* Form to add a new product */}
      <form onSubmit={handleSubmit} className="add-product-form">
        <h3>Add New Product</h3>
        
        <input
          type="text"
          name="brand"
          value={newProduct.brand}
          onChange={handleInputChange}
          placeholder="Brand"
          required
        />
        
        <input
          type="text"
          name="model"
          value={newProduct.model}
          onChange={handleInputChange}
          placeholder="Model"
          required
        />
        
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        
        <input
          type="url"
          name="image"
          value={newProduct.image}
          onChange={handleInputChange}
          placeholder="Image URL"
          required
        />
        
        <input
          type="text"
          name="sku"
          value={newProduct.sku}
          onChange={handleInputChange}
          placeholder="SKU"
          required
        />
        
        <input
          type="text"
          name="sizes"
          value={newProduct.sizes}
          onChange={handleInputChange}
          placeholder="Sizes (comma separated x'x,x'x,x'x)"
          required
        />
        
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        
        <button type="submit">Add Product</button>
      </form>

      {/* List of existing products */}
      <div className="product-list">
        <h3>Existing Products</h3>
        {products.map((product) => (
          <div key={product.sku} className="product-item">
            <img src={product.image} alt={product.model} />
            <div>
              <h4>{product.model}</h4>
              <p>{product.description}</p>
              <p>${product.price.toFixed(2)}</p>
              <p>Sizes: {product.sizes.join(', ')}</p>
              <button onClick={() => onRemoveProduct(product.sku)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
