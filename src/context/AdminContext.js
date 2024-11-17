import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [activities, setActivities] = useState([
    { datetime: new Date(), username: 'johnDoe', type: 'login' },
    { datetime: new Date(), username: 'janeDoe', type: 'add-to-cart' },
    // Example activities
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Surfboard 1',
      description: 'High-quality surfboard',
      image: 'https://example.com/surfboard1.jpg',
    },
    // Example products
  ]);

  const addActivity = (activity) => {
    setActivities((prev) => [...prev, activity]);
  };

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: prev.length + 1 }]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <AdminContext.Provider value={{ activities, addActivity, products, addProduct, removeProduct }}>
      {children}
    </AdminContext.Provider>
  );
};
