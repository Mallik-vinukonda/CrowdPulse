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

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet Security**: Security headers for protection
- **File Upload Validation**: Secure file upload with type checking
- **Role-Based Access Control**: Different permissions for users and admins





For support or questions, please open an issue on the GitHub repository.
