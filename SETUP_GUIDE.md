# Radhe Stationery - Quick Setup Guide

## Step-by-Step Setup

### 1. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Create a database user with username/password
5. Whitelist your IP (or 0.0.0.0 for development)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/radhe-stationery?retryWrites=true&w=majority`

### 2. Razorpay Setup

1. Go to https://razorpay.com
2. Sign up and verify your account
3. Go to Settings → API Keys
4. Copy Test Key ID and Secret
5. For production, switch to Live Keys

**Test Card Details:**
- Card: 4111 1111 1111 1111
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

### 3. Cloudinary Setup

1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard
4. Copy Cloud Name
5. Go to Settings → API Keys
6. Copy API Key and API Secret

### 4. NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Google OAuth (Optional)

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://yourdomain.com/api/auth/callback/google
6. Copy Client ID and Client Secret

### 6. Environment Variables

Create `.env.local`:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radhe-stationery?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Razorpay (Test Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Admin
ADMIN_EMAIL=admin@radhestationery.com
```

### 7. Install Dependencies

```bash
npm install
```

### 8. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 9. Create Admin Account

1. Go to http://localhost:3000/auth/signup
2. Create account with admin email
3. Open MongoDB Atlas
4. Go to Collections → Users
5. Find your user document
6. Change `role` from "user" to "admin"
7. Sign out and sign back in

### 10. Add Sample Products

1. Go to http://localhost:3000/admin
2. Click "Add Product"
3. Fill in product details
4. For images, use Cloudinary URLs or upload via Cloudinary dashboard first

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/radhe-stationery.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Add Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure `NEXTAUTH_URL` is set to your production domain

### 4. Deploy

```bash
vercel deploy --prod
```

Or just push to main branch - Vercel will auto-deploy.

## Troubleshooting

### MongoDB Connection Error
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Razorpay Payment Fails
- Verify test keys are correct
- Check that amount is in paise (multiply by 100)
- Ensure signature verification is working

### Cloudinary Upload Issues
- Verify cloud name, API key, and secret
- Check folder permissions in Cloudinary
- Ensure image format is supported

### NextAuth Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Admin Access Denied
- Verify user role is "admin" in MongoDB
- Check that you're signed in with admin account
- Clear session cookies

## Production Checklist

- [ ] Switch Razorpay to Live Keys
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Enable HTTPS
- [ ] Set up email notifications
- [ ] Configure backup strategy for MongoDB
- [ ] Set up monitoring/logging
- [ ] Test payment flow end-to-end
- [ ] Test order confirmation emails
- [ ] Verify all images load correctly
- [ ] Test on mobile devices
- [ ] Set up SSL certificate
- [ ] Configure CDN for images
- [ ] Set up analytics
- [ ] Create admin backup user

## Support

For detailed documentation, see README.md
