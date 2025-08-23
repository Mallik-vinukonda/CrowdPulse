# CrowdPulse - Community Issue Reporting Platform

CrowdPulse is a full-stack web application that allows users to report community issues, earn credits for contributions, and access educational resources. The platform features a credit-based reward system and admin moderation capabilities.

## Features

### User Features

- **Issue Reporting**: Submit community issues with photos, descriptions, and location data
- **Credit System**: Earn credits for submitting and having issues accepted
- **Resource Hub**: Access educational courses using earned credits
- **Credit Redemption**: Request payouts for accumulated credits
- **User Dashboard**: Track submissions, credits, and activity

### Admin Features

- **Issue Moderation**: Review and approve/reject submitted issues
- **User Management**: View and manage user accounts
- **Credit Management**: Handle redemption requests
- **Course Management**: Create and manage educational content
- **Analytics Dashboard**: View platform statistics

### Technical Features

- **Secure Authentication**: JWT-based authentication with role-based access control
- **File Upload**: Image upload with validation and storage
- **Input Validation**: Comprehensive server-side validation
- **Error Handling**: Centralized error handling and logging
- **Rate Limiting**: Protection against abuse
- **Database Indexing**: Optimized queries for performance

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security headers
- **Express Rate Limit** for rate limiting
- **Express Validator** for input validation
- **bcryptjs** for password hashing

### Frontend

- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Heroicons** for icons

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd CrowdPulse/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/crowdpulse

   # JWT Secret (generate a strong secret for production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   CLIENT_URL=http://localhost:5173

   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

4. **Create uploads directory**

   ```bash
   mkdir uploads
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd CrowdPulse/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Setup

1. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

2. **Create an admin user** (optional, for admin panel access)
   ```javascript
   // Connect to MongoDB and run this script
   use crowdpulse
   db.admins.insertOne({
     name: "Admin User",
     email: "admin@crowdpulse.com",
     password: "$2a$10$hashedPasswordHere", // Use bcrypt to hash
     isActive: true,
     createdAt: new Date()
   })
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/me` - Get current user profile
- `POST /api/admin/login` - Admin login

### Issue Management

- `POST /api/issue` - Submit new issue (with file upload)
- `GET /api/issue` - List issues (admin: all, user: own)
- `GET /api/issue/mine` - Get user's issues
- `POST /api/issue/:id/review` - Review issue (admin only)

### Credit System

- `GET /api/credit/me` - Get user credits and transactions
- `POST /api/credit/redeem` - Request credit redemption
- `GET /api/credit/redemptions` - Get user's redemption history
- `GET /api/credit/redemptions/all` - Get all redemptions (admin)
- `POST /api/credit/redeem/:id/review` - Process redemption (admin)

### Course Management

- `GET /api/course` - List available courses
- `POST /api/course` - Create course (admin only)
- `GET /api/course/mine` - Get unlocked courses
- `POST /api/course/:id/unlock` - Unlock course with credits
- `GET /api/course/:id` - Get course details

### Admin Endpoints

- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/users` - List all users

## Project Structure

```
CrowdPulse/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validation.js        # Input validation middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Issue.js             # Issue model
│   │   ├── Course.js            # Course model
│   │   ├── Admin.js             # Admin model
│   │   ├── CreditTransaction.js # Credit transaction model
│   │   └── RedemptionRequest.js # Redemption request model
│   ├── routes/
│   │   ├── user.js              # User routes
│   │   ├── issue.js             # Issue routes
│   │   ├── course.js            # Course routes
│   │   ├── credit.js            # Credit routes
│   │   ├── admin.js             # Admin routes
│   │   └── resource.js          # Resource routes
│   ├── uploads/                 # File upload directory
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── server.js               # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── SubmitIssue.jsx  # Issue submission
│   │   │   ├── CourseCatalog.jsx # Course catalog
│   │   │   ├── RedeemCredits.jsx # Credit redemption
│   │   │   ├── ReviewIssues.jsx # Issue review (admin)
│   │   │   ├── AdminLogin.jsx   # Admin login
│   │   │   ├── AdminPanel.jsx   # Admin panel
│   │   │   └── Profile.jsx      # User profile
│   │   ├── utils/
│   │   │   ├── api.js           # API client
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # App entry point
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── vite.config.js          # Vite configuration
└── README.md
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet Security**: Security headers for protection
- **File Upload Validation**: Secure file upload with type checking
- **Role-Based Access Control**: Different permissions for users and admins

## Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow RESTful API conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors gracefully

### Database Best Practices

- Use indexes for frequently queried fields
- Implement proper data validation
- Use transactions for critical operations
- Regular backups for production

### Security Best Practices

- Never commit sensitive data to version control
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication and authorization
- Keep dependencies updated

## Deployment

CrowdPulse can be deployed to various platforms. We recommend **Heroku** or **Render** for easy deployment.

### Quick Deploy Options

#### Heroku (Recommended)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### Render

1. Fork this repository
2. Connect to [Render](https://render.com)
3. Create a new Blueprint
4. Select your forked repository
5. Deploy automatically using `render.yaml`

### Manual Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Production Environment Variables

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
PORT=5000
```

### Build Commands

```bash
# Install all dependencies
npm run install:all

# Build for production
npm run build:prod

# Start production server
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on the GitHub repository.
