# GameKart Backend 🛒

This is the backend for **GameKart**, a full-stack e-commerce platform for gaming consoles and accessories. Built using **Node.js** and **Express**, it handles user authentication, role-based access, product and order management, and supports Google OAuth login with pre-approved email access.

## ✨ Features

- RESTful APIs for:
  - Order creation and management
  - Admin and Rider-specific routes
- Google OAuth login
- Role-based access (admin, rider, customer)
- Only approved users (via `approved_emails` collection) can log in
- Admin can assign riders and change order status
- Riders can view and update assigned orders
- MongoDB as the primary data store

## 🔐 Login Access (Approved Emails Only)

Only pre-approved emails can log in. Add users to the `approved_emails` collection using the `seed.js` script.

### ➕ Add Approved Emails

1. Modify `seed.js`:

```js
const emails = [
  { email: 'abhishek@zuvees.com', role: 'admin' },
  { email: 'rider1@example.com', role: 'rider' },
  { email: 'customer1@example.com', role: 'customer' }
];
```
Run the script:

```bash
node seed.js
```

## 🔧 Setup Instructions

Clone the repository:

```bash
git clone https://github.com/akashtripathi1/gamekart-backend.git
cd gamekart-backend
```

Install dependencies:

```bash
npm install
```

Create a .env file with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```
Start the server:

```bash
npm run dev
```

## 🧩 Related Repositories

- Frontend: [GameKart Frontend](https://github.com/akashtripathi1/gamekart-frontend)
