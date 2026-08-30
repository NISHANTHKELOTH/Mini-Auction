# Mini Auction

**Mini Auction** is a full-stack web application I built to create a simple online auction experience.

The idea is straightforward: users can create auctions, other users can view them and place bids, and the highest bid can be tracked while the auction is active.

I built this project mainly to get practical experience with full-stack development and to understand how the frontend, backend, database, and authentication work together in a real application.

## Live Website

https://mini-auction-git-main-nishanth-projects.vercel.app/

## What you can do

* Create an account and log in
* Create an auction
* View available auctions
* Place bids on auctions
* See the current highest bid
* Manage auction details
* Check auction status
* Download auction-related information as a PDF

## Technologies I used

**Frontend**

* React
* Vite
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Authentication**

* JWT
* bcrypt

**Other**

* jsPDF

## How the project works

The frontend is built with React and handles the user interface.

The backend uses Node.js and Express to handle requests from the frontend and perform operations such as user authentication, creating auctions, and placing bids.

MongoDB is used to store the users, auctions, and bidding information.

When a user places a bid, the backend checks the bid and updates the auction with the new highest bid.

## Running the project locally

First, clone the repository:

```bash
git clone <your-github-repository-url>
cd Mini-Auction
```

Install the dependencies for the frontend and backend:

```bash
cd client
npm install
```

Then:

```bash
cd ../server
npm install
```

Create a `.env` file inside the backend folder and add your MongoDB connection string and JWT secret.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

Then start the frontend from the client folder:

```bash
npm run dev
```

## Project Structure

```text
Mini-Auction
│
├── client
│   └── React frontend
│
├── server
│   └── Node.js + Express backend
│
└── README.md
```

## Things I want to improve

This is still a project that I can keep improving. Some things I would like to add in the future are real-time bidding, notifications, better auction history, image uploads, payment integration, and an admin panel.

## Author

**Nishanth Keloth**

This project was built as part of my journey in learning and building full-stack web applications.
