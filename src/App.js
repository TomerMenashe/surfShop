import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SurfboardsPage from './components/pages/SurfboardsPage';
import SurfboardDetail from './components/pages/SurfboardDetail';
import FinsPage from './components/pages/FinsPage';
import AccessoriesPage from './components/pages/AccessoriesPage';
import ApparelPage from './components/pages/ApparelPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import CartScreen from './components/pages/CartScreen';  // Import the Cart screen
import CheckoutScreen from './components/pages/CheckoutScreen';  // Import the Checkout screen
import ThankYouScreen from './components/pages/ThankYouScreen'; // Import the Thank You screen
import AdminScreen from './components/pages/AdminScreen'; // Import the Admin screen

import PrivateRoute from './utils/PrivateRoute';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/authController';
import { CartProvider } from './context/CartContext';  // Import CartProvider
import { AdminProvider } from './context/AdminContext'; // Import AdminProvider

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider> {/* Wrap the app in AdminProvider for admin data */}
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />  {/* Home Page */}
                <Route path="surfboards" element={<SurfboardsPage />} />
                <Route path="surfboards/:sku" element={<SurfboardDetail />} />  {/* Surfboard Details using SKU */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              {/* Private Routes */}
              <Route path="/" element={<Layout />}>
                {/* Cart and Checkout are protected */}
                <Route path="cart" element={<PrivateRoute><CartScreen /></PrivateRoute>} />  {/* Private Cart Screen */}
                <Route path="checkout" element={<PrivateRoute><CheckoutScreen /></PrivateRoute>} />  {/* Private Checkout Screen */}

                {/* Other Private Routes */}
                <Route path="accessories" element={<PrivateRoute><AccessoriesPage /></PrivateRoute>} />
                <Route path="apparel" element={<PrivateRoute><ApparelPage /></PrivateRoute>} />
                <Route path="fins" element={<PrivateRoute><FinsPage /></PrivateRoute>} />

                {/* Admin Screen */}
                <Route path="admin" element={<PrivateRoute><AdminScreen /></PrivateRoute>} />  {/* Admin Dashboard */}
              </Route>

              {/* Thank You Screen */}
              <Route path="/thank-you" element={<ThankYouScreen />} /> {/* Thank You Page */}
            </Routes>
          </Router>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
