# Smart City Complaint Management System

A full-stack web application for citizens to report city issues and for authorities to manage and resolve complaints efficiently.

## Features

### User Features
- User registration and authentication
- Submit complaints with images and map location
- Set priority levels (low, medium, high)
- Track complaint status in real-time
- View before and after images of resolved issues

### Admin Features
- Admin dashboard with analytics
- View all complaints with filters
- Update complaint status
- Upload after-images as proof of resolution
- Visual analytics with charts and graphs

## Technology Stack

- **Frontend**: React, React Router, Leaflet Maps, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **File Upload**: Multer
- **Authentication**: JWT

## Project Structure

```
smart-city-complaint-system/
├── backend/
│   ├── config/
│   │   └── multer.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   └── admin.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Navbar.css
    │   │   ├── PrivateRoute.js
    │   │   └── AdminRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Home.css
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Auth.css
    │   │   ├── UserDashboard.js
    │   │   ├── UserDashboard.css
    │   │   ├── AdminDashboard.js
    │   │   └── AdminDashboard.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Compass (local MongoDB)
- npm or yarn

### Backend Setup

1. Make sure MongoDB is running locally:
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`

2. Navigate to the backend folder:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Configure environment variables:
   - The `.env` file is already configured for local MongoDB
   - Change `JWT_SECRET` to a secure random string for production

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating a User Account

1. Open `http://localhost:3000` in your browser
2. Click "Register" and create a new account
3. Login with your credentials
4. You'll be redirected to the User Dashboard

### Submitting a Complaint

1. Click "New Complaint" button
2. Fill in the complaint details:
   - Title
   - Category (Pothole, Garbage, Water Leakage, etc.)
   - Description
   - Priority level
   - Upload an image
   - Enter address
   - Click on the map to select the exact location
3. Click "Submit Complaint"

### Creating an Admin Account

To create an admin account, you need to manually update the database:

1. Register a normal user account first
2. Connect to MongoDB:
```bash
mongosh
```

3. Switch to the database:
```bash
use smart-city-complaints
```

4. Update the user role to admin:
```bash
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

5. Login with this account to access the Admin Dashboard

### Admin Dashboard Features

1. View analytics and statistics
2. Filter complaints by status and priority
3. Click "View" on any complaint to see details
4. Update complaint status (Pending → In Progress → Resolved)
5. Upload after-image when issue is resolved

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Complaints (User)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get single complaint

### Admin
- `GET /api/admin/complaints` - Get all complaints (with filters)
- `PATCH /api/admin/complaints/:id/status` - Update complaint status
- `PATCH /api/admin/complaints/:id/after-image` - Upload after image
- `GET /api/admin/analytics` - Get analytics data

## Default Map Location

The map is centered on Delhi, India by default (28.6139, 77.2090). You can change this in `UserDashboard.js`:

```javascript
<MapContainer center={[YOUR_LAT, YOUR_LNG]} zoom={13}>
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally on port 27017
- Open MongoDB Compass and connect to `mongodb://localhost:27017`
- The database `smart-city-complaints` will be created automatically

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Set `PORT=3001` in frontend/.env file

### Map Not Loading
- Check internet connection (map tiles are loaded from OpenStreetMap)
- Ensure leaflet CSS is properly imported

### Images Not Displaying
- Ensure backend server is running
- Check that uploads folder exists in backend directory
- Verify image paths in the code match your backend URL

## Future Enhancements

- Email notifications for status updates
- SMS alerts for high-priority complaints
- Mobile app version
- Real-time chat between users and admins
- Complaint assignment to specific departments
- Public complaint map view
- Export reports as PDF

## License

MIT License

## Contributors

Your Name

---

For any issues or questions, please create an issue in the repository.
