//** Main application entry point: sets up routing for public and private routes **//

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SurfboardsPage from './components/pages/SurfboardsPage';
import SurfboardDetail from './components/pages/SurfboardDetail';
import LiveShoreCamera from './components/pages/LiveShoreCamera';
import WeatherPage from './components/pages/WeatherPage';
import ReviewSection from './components/pages/ReviewSection';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import CartScreen from './components/pages/CartScreen';
import CheckoutScreen from './components/pages/CheckoutScreen';
import ThankYouScreen from './components/pages/ThankYouScreen';
import AdminScreen from './components/pages/AdminScreen';
import SurfingRecommendationPage from './components/pages/SurfingRecommendationPage';
import ReadMePage from './components/pages/ReadMePage';
import LLMPage from './components/pages/LLMPage';
import PrivateRoute from './utils/PrivateRoute';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      {/* Authentication and Cart Providers wrap the entire app for global state management */}
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public (unprotected) routes */}
            <Route path="/" element={<Layout />}>
              {/* Default home page */}
              <Route index element={<HomePage />} />
              
              {/* Surfboards listing and details */}
              <Route path="surfboards" element={<SurfboardsPage />} />
              <Route path="surfboards/:sku" element={<SurfboardDetail />} />
              
              {/* Auth pages */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* Additional pages */}
              <Route path="/readme.html" element={<ReadMePage />} />
              <Route path="/llm.html" element={<LLMPage />} />
            </Route>

            {/* Private (protected) routes */}
            <Route path="/" element={<Layout />}>
              <Route
                path="surf-recommendation"
                element={
                  <PrivateRoute>
                    <SurfingRecommendationPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="live-camera"
                element={
                  <PrivateRoute>
                    <LiveShoreCamera />
                  </PrivateRoute>
                }
              />
              <Route
                path="weather"
                element={
                  <PrivateRoute>
                    <WeatherPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="reviews"
                element={
                  <PrivateRoute>
                    <ReviewSection />
                  </PrivateRoute>
                }
              />
              <Route
                path="cart"
                element={
                  <PrivateRoute>
                    <CartScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="checkout"
                element={
                  <PrivateRoute>
                    <CheckoutScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <PrivateRoute>
                    <AdminScreen />
                  </PrivateRoute>
                }
              />
              {/* Thank-you page after successful checkout */}
              <Route path="/thank-you" element={<ThankYouScreen />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
