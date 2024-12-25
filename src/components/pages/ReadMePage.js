//** ReadMe page component for explaining store details, routes, and project structure **//

import React from 'react';
import '../../styles/ReadMePage.css';

const ReadMePage = () => {
  return (
    <div className="readme-container">
      {/* Store Title */}
      <h1 className="readme-title">Tomer's Surf Shop</h1>
      
      {/* Store Name Section */}
      <div className="readme-section">
        <h2>Store Name</h2>
        <p>Tomer's Surf Shop</p>
      </div>
      
      {/* Store Offerings Section */}
      <div className="readme-section">
        <h2>What We Sell</h2>
        <p>
          At Tomer's Surf Shop, we offer a wide range of surfboards tailored for surf enthusiasts.
          Additionally, we provide tools and resources to enhance your surfing experience, including:
        </p>
        <ul>
          <li>Spot Recommendations</li>
          <li>Weather Forecasts</li>
          <li>Customer Reviews</li>
          <li>Live Shore Cameras</li>
        </ul>
      </div>
      
      {/* Additional Pages Section */}
      <div className="readme-section">
        <h2>Additional Pages</h2>
        <p>
          - Surfboard Details: Click on a surfboard to see its details, select sizes, and add it to your cart.
          <br />
          - Cart: View and manage your cart items.
          <br />
          - Checkout: Finalize your purchase securely.
          <br />
          - Surf Recommendations: Explore the best spots for surfing.
          <br />
          - Weather Forecast: Stay updated on surf conditions.
          <br />
          - Reviews: Read and share experiences with other surfers.
          <br />
          - Live Cameras: Watch real-time surf conditions.
        </p>
        <p>To operate, navigate through the header or use the search bar to find products and pages.</p>
      </div>
      
      {/* Challenges Section */}
      <div className="readme-section">
        <h2>Challenges</h2>
        <p>
          Integrating dynamic routes for surfboard details and implementing cart functionality were challenging.
          Additionally, setting up private routes for features like live cameras and spot recommendations required extra effort.
          User authentication was implemented using React Context API for global state management. The <code>AuthContext</code> handles the authentication state, including login, logout, and user role management. 
          Protected routes were secured using a <code>PrivateRoute</code> component that checks if a user is authenticated before granting access to specific pages. For secure storage, authentication tokens are managed and validated on the server side.
        </p>
      </div>
      
      {/* Project Partners Section */}
      <div className="readme-section">
        <h2>Project Partners</h2>
        <p>
          <b>Partner Name:</b> [Tomer Menashe] &lt;208640557&gt;
          <br />
          <b>My Contribution:</b> Designed the frontend and implemented features such as the surfboard detail pages, cart, and checkout.
          <br />
          <b></b> Developed backend APIs and handled private routes like live cameras and spot recommendations.
        </p>
      </div>
      
      {/* Supported Routes Section */}
      <div className="readme-section">
        <h2>Supported Routes</h2>
        <ul>
          <li>/ - Home Page</li>
          <li>/surfboards - Surfboard Listing</li>
          <li>/surfboards/:sku - Surfboard Details</li>
          <li>/login - Login Page</li>
          <li>/register - Register Page</li>
          <li>/readme.html - ReadMe</li>
          <li>/surf-recommendation - Spot Recommendations (Private)</li>
          <li>/live-camera - Live Shore Cameras (Private)</li>
          <li>/weather - Weather Forecast (Private)</li>
          <li>/reviews - Customer Reviews (Private)</li>
          <li>/cart - Cart (Private)</li>
          <li>/checkout - Checkout (Private)</li>
          <li>/admin - Admin Screen (Private)</li>
          <li>/thank-you - Thank You Page</li>
        </ul>
      </div>
      
      {/* App Structure Section */}
      <div className="readme-section">
        <h2>App Structure</h2>
        <pre>
{`surfshop-app/
│
├── server/
│   ├── data/
│   │   ├── activity.json
│   │   ├── carts.json
│   │   ├── purchases.json
│   │   ├── reviews.json
│   │   ├── surfboards.json
│   │   └── users.json
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── activityRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── liveCameraRoutes.js
│   │   ├── locationRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── surfboardRoutes.js
│   │   └── weatherRoutes.js
│   ├── utils/
│   │   └── persist.js
│   ├── .env
│   ├── config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── README.md
│
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   └── Layout.js
│   ├── pages/
│   │   ├── AdminActivityPage.js
│   │   ├── AdminScreen.js
│   │   ├── CartScreen.js
│   │   ├── CheckoutScreen.js
│   │   ├── HomePage.js
│   │   ├── LiveShoreCamera.js
│   │   ├── LoginPage.js
│   │   ├── ManageProducts.js
│   │   ├── PageWrapper.js
│   │   ├── ReadMePage.js
│   │   ├── RegisterPage.js
│   │   ├── ReviewSection.js
│   │   ├── SurfboardDetail.js
│   │   ├── SurfboardsPage.js
│   │   ├── SurfingRecommendationPage.js
│   │   ├── ThankYouScreen.js
│   │   └── WeatherPage.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── styles/
│   │   ├── AdminActivityPage.css
│   │   ├── AdminScreen.css
│   │   ├── AuthPages.css
│   │   ├── CartScreen.css
│   │   ├── CheckoutScreen.css
│   │   ├── Footer.css
│   │   ├── global.css
│   │   ├── Header.css
│   │   ├── HomePage.css
│   │   ├── LiveShoreCamera.css
│   │   ├── ManageProducts.css
│   │   ├── ReadMePage.css
│   │   ├── ReviewSection.css
│   │   ├── SurfboardDetail.css
│   │   ├── SurfboardsPage.css
│   │   ├── SurfingRecommendationPage.css
│   │   ├── ThankYouScreen.css
│   │   └── WeatherPage.css
│   ├── utils/
│   │   ├── PrivateRoute.js
│   │   └── validate.js
│   ├── App.js
│   ├── index.js
│   └── theme.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
`}
        </pre>
      </div>
    </div>
  );
};

export default ReadMePage;
