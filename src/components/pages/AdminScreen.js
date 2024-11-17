import React, { useEffect, useState, useCallback } from 'react';
import AdminActivityTable from './AdminActivityTable';
import ManageProducts from './ManageProducts';
import PageWrapper from './PageWrapper';
import axios from 'axios'; // Axios for making server requests
import '../../styles/AdminScreen.css';

const AdminScreen = () => {
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Fetch user activities
  const fetchUserActivities = useCallback(async () => {
    setActivitiesLoading(true);
    try {
      const response = await axios.get('/api/admin/activities'); // Adjust endpoint as needed
      setActivities(response.data);
      setActivitiesError(null);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      setActivitiesError('Failed to fetch user activities');
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  // Fetch product data
  const fetchProductData = useCallback(async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get('/api/surfboards'); // Adjust endpoint as needed
      setProducts(response.data);
      setProductsError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsError('Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserActivities();
    fetchProductData();
  }, [fetchUserActivities, fetchProductData]);

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
          fetchProducts={fetchProductData}
          productsLoading={productsLoading}
          productsError={productsError}
        />
      </div>
    </PageWrapper>
  );
};

export default AdminScreen;
