# ComplaintDesk — Complaint Management System

A full-stack complaint management system built with React, Node.js, Express, MongoDB, and JWT authentication.

---

## 📁 Folder Structure

```
complaint-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Signup & login logic
│   │   └── complaintController.js  # Complaint CRUD logic
│   ├── middleware/
│   │   └── auth.js                 # JWT protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js                 # User schema (email, password, role)
│   │   └── Complaint.js            # Complaint schema (title, desc, status)
│   ├── routes/
│   │   ├── auth.js                 # POST /api/auth/signup, /login
│   │   └── complaints.js           # Complaint CRUD routes
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── server.js                   # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js            # Top navigation bar
    │   │   ├── PrivateRoute.js      # Auth-protected route wrapper
    │   │   └── StatusBadge.js       # Color-coded status pill
    │   ├── context/
    │   │   └── AuthContext.js       # Global auth state (user, token, login, logout)
    │   ├── pages/
    │   │   ├── Login.js             # Login page
    │   │   ├── Signup.js            # Signup page
    │   │   ├── UserDashboard.js     # User's complaint list
    │   │   ├── SubmitComplaint.js   # Submit new complaint form
    │   │   └── AdminDashboard.js    # Admin: all complaints + status update
    │   ├── utils/
    │   │   └── api.js               # Axios instance with JWT interceptor
    │   ├── App.js                   # Root component with React Router
    │   ├── index.js                 # React DOM entry point
    │   └── index.css                # Tailwind CSS directives + global styles
    ├── .env                         # Frontend environment variables
    ├── package.json
    └── tailwind.config.js
```

---

## ⚙️ Prerequisites

Make sure you have these installed:
- **Node.js** v16 or higher → https://nodejs.org
- **MongoDB** running locally on port 27017 → https://www.mongodb.com/try/download/community
- **npm** (comes with Node.js)

---

## 🚀 Setup Instructions

### Step 1 — Clone / extract the project

```bash
cd complaint-system
```

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Create / verify your `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/complaint_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

Start the backend server:
```bash
# For development (auto-restart on changes):
npm run dev

# For production:
npm start
```

✅ You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Set up the Frontend

Open a **new terminal tab/window** and run:

```bash
cd frontend
npm install
```

Verify your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React development server:
```bash
npm start
```

✅ The app opens at **http://localhost:3000**

---

## 🧪 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT | No |

**Signup body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

**Login body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Complaints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/complaints` | Submit a complaint | User |
| GET | `/api/complaints` | Get my complaints | User |
| GET | `/api/complaints/all` | Get all complaints | Admin only |
| PUT | `/api/complaints/:id` | Update status | Admin only |

**Submit complaint body:**
```json
{
  "title": "Issue with product",
  "description": "Detailed description here..."
}
```

**Update status body:**
```json
{
  "status": "In Progress"
}
```

All protected routes need this header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🎨 Features

### User Features
- ✅ Register & login with JWT authentication
- ✅ Submit complaints with title + description
- ✅ View own complaints with status tracking
- ✅ Filter complaints by status
- ✅ Logout functionality

### Admin Features
- ✅ View ALL complaints from all users
- ✅ See which user submitted each complaint
- ✅ Update complaint status via dropdown (instant UI update)
- ✅ Filter complaints by status
- ✅ Summary stats cards

### UI Features
- ✅ Color-coded status badges:
  - 🟡 **Yellow** → Pending
  - 🔵 **Blue** → In Progress
  - 🟢 **Green** → Resolved
- ✅ Responsive design (mobile-friendly)
- ✅ Dark theme with modern card layout
- ✅ Loading states and error messages
- ✅ Form validation on frontend and backend

---

## 🔒 Security Notes

1. **Passwords** are hashed using `bcryptjs` with 10 salt rounds
2. **JWT tokens** expire after 7 days
3. **Admin routes** are protected server-side (not just frontend)
4. In production:
   - Change `JWT_SECRET` to a long random string
   - Remove the ability to self-assign admin role during signup
   - Use HTTPS
   - Set `CORS` to only allow your frontend domain

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |

---

## 💡 Quick Demo

1. Go to http://localhost:3000
2. Sign up as a **User** → submit some complaints
3. Sign up as an **Admin** → manage complaint statuses
4. Or use the demo hint on the login page to create an admin account directly
