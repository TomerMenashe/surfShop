//** Thank you screen displayed after a successful purchase **//

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ThankYouScreen.css';

const ThankYouScreen = () => {
  return (
    <div className="thank-you-container">
      <h1 className="thank-you-heading">Thank You for Your Purchase!</h1>
      <p className="thank-you-message">
        Your order has been successfully placed. We hope you enjoy your new surfboard!
      </p>
      <Link to="/" className="home-link">
        <button className="home-btn">Return to Home</button>
      </Link>
    </div>
  );
};

export default ThankYouScreen;
