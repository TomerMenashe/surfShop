//** AdminScreen component that aggregates user activity logs and product management **//

import React, { useEffect, useState, useCallback } from 'react';
import AdminActivityTable from './AdminActivityTable';
import ManageProducts from './ManageProducts';
import PageWrapper from './PageWrapper';
import axios from 'axios';
import '../../styles/AdminScreen.css';

//** Main AdminScreen component **//
const AdminScreen = () => {
  //** State for activities data **//
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);

  //** State for products data **//
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  //** Fetch user activities (calls /api/activity/export-activities) **//
  const fetchUserActivities = useCallback(async () => {
    setActivitiesLoading(true);
    try {
      const response = await axios.get('/api/activity/export-activities');
      //** Convert data into an array of activity objects with username included **//
      setActivities(
        Object.entries(response.data).flatMap(([username, userActivities]) =>
          userActivities.map((activity) => ({
            ...activity,
            username,
          }))
        )
      );
      setActivitiesError(null);
    } catch (error) {
      console.error('[ERROR] Error fetching user activities:', error);
      setActivitiesError('Failed to fetch user activities.');
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  //** Fetch product data (calls /api/surfboards) **//
  const fetchProductData = useCallback(async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get('/api/surfboards');
      setProducts(response.data);
      setProductsError(null);
    } catch (error) {
      console.error('[ERROR] Error fetching products:', error);
      setProductsError('Failed to fetch products.');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  //** Handle adding a new product by calling POST /api/surfboards **//
  const handleAddProduct = async (product) => {
    try {
      console.log('Submitting new product:', product);
      const response = await axios.post('/api/surfboards', product);
      console.log('Product added successfully:', response.data);
    } catch (err) {
      console.error('Error adding product:', err.response ? err.response.data : err.message);
      alert('Failed to add product. Please try again.');
    }
  };

  //** Handle removing a product by SKU (calls DELETE /api/surfboards/:sku) **//
  const handleRemoveProduct = async (sku) => {
    try {
      //** Refresh product list after deletion **//
      fetchProductData();
    } catch (error) {
      console.error('[ERROR] Failed to remove product:', error);
      setProductsError('Failed to remove product. Please try again.');
    }
  };

  //** Initial data load: fetch activities and product data **//
  useEffect(() => {
    fetchUserActivities();
    fetchProductData();
  }, [fetchUserActivities, fetchProductData]);

  //** Render the admin dashboard **//
  return (
    <PageWrapper>
      <div className="admin-screen-container">
        <h1>Admin Dashboard</h1>
        <AdminActivityTable
          activities={activities}
          loading={activitiesLoading}
          error={activitiesError}
        />
        <ManageProducts
          products={products}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
          productsLoading={productsLoading}
          productsError={productsError}
        />
      </div>
    </PageWrapper>
  );
};

export default AdminScreen;
