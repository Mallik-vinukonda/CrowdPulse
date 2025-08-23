# Render Deployment Setup

## Issue: MongoDB Not Available on Render Free Tier

Render's free tier doesn't include MongoDB. Here's how to fix this:

## Option 1: Use MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (free M0 tier)
4. Create a database user
5. Whitelist IP addresses (use 0.0.0.0/0 for all IPs)
6. Get your connection string

### Step 2: Update Render Environment Variables

1. Go to your Render service dashboard
2. Click on `crowdpulse-backend`
3. Go to "Environment" tab
4. Update `MONGODB_URI` with your Atlas connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/crowdpulse?retryWrites=true&w=majority
   ```

### Step 3: Redeploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Monitor the logs for successful deployment

## Option 2: Use Heroku Instead (Has MongoDB Addon)

If you prefer a simpler setup with included MongoDB:

1. Go to your GitHub repository
2. Click the "Deploy to Heroku" button
3. Heroku will automatically set up MongoDB via addon

## Option 3: Manual Render Setup (Without Blueprint)

1. **Delete current services** in Render dashboard
2. **Create Web Service manually**:

   - Name: `crowdpulse-backend`
   - Build Command: `npm install && npm run install:all && npm run build:prod`
   - Start Command: `npm run start:prod`
   - Environment: Node

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your-random-secret-here
   PORT=5000
   CORS_ORIGIN=*
   MONGODB_URI=your-mongodb-atlas-connection-string
   ```

## Quick Fix for Current Deployment

Since you already have the PostgreSQL database created, you can:

1. **Delete the PostgreSQL database** (not needed)
2. **Update MONGODB_URI** environment variable with MongoDB Atlas connection
3. **Redeploy the service**

## MongoDB Atlas Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Replace:

- `<username>`: Your MongoDB Atlas username
- `<password>`: Your MongoDB Atlas password
- `<cluster-name>`: Your cluster name
- `<database-name>`: `crowdpulse`
