# Deployment Guide

This guide covers deploying CrowdPulse to Heroku and Render.

## Heroku Deployment

### Prerequisites

- Heroku CLI installed
- Git repository initialized
- Heroku account

### Steps

1. **Login to Heroku**

   ```bash
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

3. **Add MongoDB Addon**

   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(openssl rand -base64 32)
   heroku config:set CORS_ORIGIN=https://your-app-name.herokuapp.com
   ```

5. **Deploy**

   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

### One-Click Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Render Deployment

### Prerequisites

- Render account
- GitHub repository

### Steps

1. **Connect Repository**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing CrowdPulse

2. **Configure Blueprint**

   - Render will automatically detect the `render.yaml` file
   - Review the configuration
   - Click "Apply"

3. **Environment Variables**
   The following variables will be automatically set:

   - `NODE_ENV`: production
   - `JWT_SECRET`: auto-generated
   - `PORT`: 5000
   - `CORS_ORIGIN`: \*
   - `MONGODB_URI`: from database connection

4. **Deploy**
   - Render will automatically build and deploy
   - Monitor the build logs
   - Access your app via the provided URL

### Manual Web Service (Alternative)

1. **Create Web Service**

   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect repository

2. **Configure Service**

   - Name: `crowdpulse`
   - Environment: `Node`
   - Build Command: `npm run build:prod`
   - Start Command: `npm run start:prod`

3. **Add Database**
   - Create PostgreSQL or MongoDB database
   - Copy connection string to `MONGODB_URI` env var

## Environment Variables

Both platforms need these environment variables:

| Variable      | Description               | Example               |
| ------------- | ------------------------- | --------------------- |
| `NODE_ENV`    | Node environment          | `production`          |
| `JWT_SECRET`  | JWT signing secret        | `your-secret-key`     |
| `MONGODB_URI` | MongoDB connection string | `mongodb://...`       |
| `PORT`        | Server port               | `5000`                |
| `CORS_ORIGIN` | Allowed CORS origins      | `https://yourapp.com` |

## Post-Deployment

1. **Test the API**

   ```bash
   curl https://your-app.herokuapp.com/api/health
   ```

2. **Check Logs**

   - Heroku: `heroku logs --tail`
   - Render: View logs in dashboard

3. **Monitor Performance**
   - Both platforms provide monitoring dashboards
   - Set up alerts for downtime

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

2. **Database Connection**

   - Verify MONGODB_URI is set correctly
   - Check database addon status
   - Test connection locally first

3. **Environment Variables**
   - Ensure all required vars are set
   - Check for typos in variable names
   - Verify secrets are properly generated

### Support

- Heroku: [Dev Center](https://devcenter.heroku.com/)
- Render: [Documentation](https://render.com/docs)
