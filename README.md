<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com//subh-cs/Silpo">
    <img src="/assets/BlareLogo.png" alt="Logo" width="200">
  </a>

<h3 align="center">Silpo</h3>

  <p align="center">
    Experience the beauty of Santiniketan
    <br />
    <a href="https://github.com/subh-cs/Silpo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://subh-shop.herokuapp.com">View Demo</a>
    ·
    <a href="https://github.com/subh-cs/Silpo/issues">Report Bug</a>
    ·
    <a href="https://github.com/subh-cs/Silpo/issues">Request Feature</a>
  </p>
</div>


Silpo is an e-commerce platform for buying arts in Bolpur, Santiniketan. It is built using the MERN stack (MongoDB, Express, React, and Node.js) and includes a customer panel, an admin panel, and a driver panel.

## Features

- Customer Panel:
  - Browse and search a catalog of products
  - Add products to a shopping cart and place an order
  - View order history and update personal information

- Admin Panel:
  - View and manage orders, customers, and other data
  - Add, update, and delete products
  - Track stock levels and reorder products as needed
  - View and update customer information

- Driver Panel:
  - View and manage deliveries
  - Track delivery status and update it as needed
  - Plan efficient routes for drivers
  - Communicate with customers about delivery status and any issues that arise

## Tech Stack

- Node.js
- express.js
- mongo.db
- react.js

## Prerequisites

- Node.js and npm (comes with Node)
- MongoDB

## Installation

1. Clone this repository
2. Navigate to the root directory and run `npm install` to install dependencies
3. Create a `.env` file in the root directory with the following variables:
   - `MONGODB_URI`: the connection string for your MongoDB database
   - `JWT_SECRET`: a secret string used to sign JSON Web Tokens (JWTs)
   - `STRIPE_SECRET_KEY`: the secret key for your Stripe account (if you want to enable payments)
4. Run `npm run dev` to start the development server
5. The application will be running on `http://localhost:3000`

## Deployment

You can use any hosting provider or platform to deploy this application. Some popular options include:

- Heroku
- AWS
- Azure
- Google Cloud Platform

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

I hope this helps! Let me know if you have any questions or need further assistance.
