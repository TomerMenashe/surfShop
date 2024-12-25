# SurfShop App

Welcome to the SurfShop project! This application is a complete online surf store allowing users to browse, purchase surfboards and accessories, check live weather and camera feeds, and explore surfing recommendations.

## Project Overview

This project consists of two main components:

1. **SurfShop API**: A Node.js backend managing surfboard inventory, user authentication, cart functionality, and API integrations for weather and live cameras.
2. **SurfShop Frontend**: A React-based frontend providing an interactive and user-friendly shopping experience.

## Features

- **Surfboard Inventory**: Browse surfboards with detailed descriptions, sizes, and images.
- **Spot recomendation**: find a the most suitable surf spot for you current level.
- **weather showcast**: get updated on the weather according to oyur location.
- **User Authentication**: Secure login and registration with "Remember Me" functionality.
- **Cart Management**: Add, update, and remove items from the cart with real-time cart updates.
- **Live Weather and Cameras**: Access live weather updates and shore cameras for surf conditions.
- **Surf Recommendations**: Explore spot recommendations for your next surfing adventure.
- **Reviews**: View and add reviews for surfboards.
- **Admin Panel**: Manage inventory, users, and reviews with special admin access.

## Screenshots

### Home Page
![Home Page](./screenshots/homepage.png)

### Surfboard Details
![Surfboard Details](./screenshots/surfboarddetails.png)

### Cart Page
![Cart Page](./screenshots/cartpage.png)

### Admin Panel
![Admin Panel](./screenshots/adminpanel.png)

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/surfshop-app.git
   cd surfshop-app

2. **Set up the backend**

Navigate to the server directory:

Install backend dependencies:
npm install

Run the server:
npm start

3. **Set up the frontend**

Open a new terminal and navigate to the main directory:

Install Node.js dependencies:
npm install

Start the React development server:
npm start

4. **Access the Application**

Open your web browser and navigate to http://localhost:3000.

### Usage
Browse the surfboards to buy from the surfboards page.
View details and select sizes for a surfboard on its dedicated page.
Add items to the cart and proceed to checkout.
Access live weather and camera feeds from the navigation bar.
Leave reviews for surfboards and read existing reviews.
Find out the current weather of you location.
Get spot recomendation according to your level.
Admin users can log in to access advanced management features.


## Project Structure

```plaintext
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

```

### Contributing
Contributions are welcome! Please follow these steps to contribute:

1.Fork the repository.

2.Create a new branch for your feature or bugfix.

3.Commit your changes with clear and descriptive messages.

4.Push your changes to your forked repository.

5.Create a pull request to the main repository.

### Author
Tomer Menashe

