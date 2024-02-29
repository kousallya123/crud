
# User Management Application

This repository contains code for a user management application built using Node.js, Express, MongoDB for the backend, and Vite with React for the frontend.

## Backend

### Dependencies
- Node.js
- Express
- MongoDB
- bcrypt
- jsonwebtoken
- Logger (custom utility for logging errors)


### Installation

1. Clone the repository:
   ```bash
  git clone [<repository_url>](https://github.com/kousallya123/crud.git)

2. Install dependencies:

   ```bash
   cd server
   npm install


3. Set environment variables:

Create a .env file in the backend directory with the following content:

    JWT_SECRET_KEY=your_jwt_secret_key
    MONGODB_URL=your mongo url
    PORT=5000


4. Run the server:

   ```bash
   npm start


The backend server will run on http://localhost:5000.

### API Routes
- POST /register: Register a new user.
- POST /login: Login with email and password to obtain JWT token.
- GET /users: Get a list of users with optional query parameters for searching, filtering, sorting, and pagination.
- PUT /users/:id: Update user details by ID.
- DELETE /users/:id: Delete a user by ID.

## Frontend


### Dependencies

- React
- Vite
- Axios
- React Toastify
- React Icons

### Installation

1. Install dependencies:
    ```bash
     cd frontend
     npm install

2. Set environment variables:

Create a .env file in the frontend directory with the following content:


VITE_REACT_APP_URL=http://localhost:5000
Update the URL based on your backend server.

3. Run the application:

   ```bash
    npm run dev

The frontend development server will run on http://localhost:5173.

Usage
- Open the application in your web browser.
- Login using valid credentials.
- View and manage users in the user list.
- Search, filter, sort, and paginate through the user list.
- Edit and delete users with respective actions.