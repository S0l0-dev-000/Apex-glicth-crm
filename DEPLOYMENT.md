# APEX GLITCH CRM - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Node.js 16+ installed
- Vercel CLI: `npm install -g vercel`
- GitHub account
- Gmail account with 2-Step Verification enabled

## 📋 Step-by-Step Deployment

### Step 1: Clone Repository
```bash
git clone https://github.com/S0l0-dev-000/Apex-glicth-crm.git
cd Apex-glicth-crm
```

### Step 2: Backend Deployment

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Email Settings
Create `.env` file in backend directory:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=your-email@gmail.com
DB_PATH=./crm.db
PORT=3001
```

#### 2.3 Deploy to Vercel
```bash
vercel --prod
```

#### 2.4 Save Backend URL
Copy the production URL (e.g., `https://backend-xxx.vercel.app`)

### Step 3: Frontend Deployment

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Update API Configuration
Edit `src/config.js` with your backend URL:
```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    uploadUrl: 'http://localhost:3001'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app',
    uploadUrl: process.env.REACT_APP_UPLOAD_URL || 'https://your-backend-url.vercel.app'
  }
};
```

#### 3.3 Deploy to Vercel
```bash
vercel --prod
```

### Step 4: Test Deployment

#### 4.1 Test Email Service
```bash
cd ../backend
node test-email.js
```

#### 4.2 Test Frontend
Visit your frontend URL and test:
- Adding a customer
- Uploading documents
- Sending emails

## 🔧 Gmail App Password Setup

### 1. Enable 2-Step Verification
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification

### 2. Generate App Password
- Go to Security → App passwords
- Select "Mail" and "Other (Custom name)"
- Name it "APEX GLITCH CRM"
- Copy the 16-character password (no spaces)

### 3. Update .env File
```env
EMAIL_PASSWORD=your16characterpassword
```

## 🚨 Troubleshooting

### Email Not Working
1. **Check .env file format**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your16characterpassword
   ADMIN_EMAIL=your-email@gmail.com
   ```

2. **Verify app password**
   - No spaces in password
   - Exactly 16 characters
   - Generated for "Mail" app

3. **Test email service**
   ```bash
   cd backend
   node test-email.js
   ```

### Build Failures
1. **Frontend build errors**
   ```bash
   cd frontend
   npm run build
   ```

2. **Check ESLint errors**
   - Fix any import/export issues
   - Ensure all dependencies installed

3. **Clear cache**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Deployment Issues
1. **Check Vercel logs**
   - Go to Vercel dashboard
   - Click on deployment
   - Check build logs

2. **Verify configuration files**
   - `vercel.json` in both frontend and backend
   - `package.json` with correct scripts

3. **Environment variables**
   - Check Vercel dashboard for env vars
   - Ensure all required vars are set

## 📊 Deployment Checklist

### Backend Checklist
- [ ] Dependencies installed
- [ ] .env file created with email credentials
- [ ] Vercel deployment successful
- [ ] Email service tested
- [ ] API endpoints accessible

### Frontend Checklist
- [ ] Dependencies installed
- [ ] config.js updated with backend URL
- [ ] Build successful locally
- [ ] Vercel deployment successful
- [ ] App loads without errors

### Integration Checklist
- [ ] Frontend can connect to backend
- [ ] Customer creation works
- [ ] Document upload works
- [ ] Email notifications received
- [ ] All features functional

## 🔄 Redeployment

### Update Backend
```bash
cd backend
git pull
vercel --prod
```

### Update Frontend
```bash
cd frontend
git pull
# Update config.js if backend URL changed
vercel --prod
```

## 📱 Custom Domain Setup

### 1. Add Custom Domain
- Go to Vercel dashboard
- Select your project
- Go to Settings → Domains
- Add your domain

### 2. Configure DNS
- Add CNAME record pointing to Vercel
- Wait for DNS propagation (up to 48 hours)

### 3. Update Configuration
- Update `config.js` with new domain
- Redeploy frontend

## 🔒 Security Considerations

### Production Security
- Use HTTPS (automatic with Vercel)
- Secure environment variables
- Implement rate limiting
- Add authentication (future enhancement)

### File Upload Security
- File type validation
- File size limits
- Secure file naming
- Virus scanning (future enhancement)

## 📈 Monitoring

### Vercel Analytics
- Enable Vercel Analytics
- Monitor performance
- Track user behavior

### Error Monitoring
- Set up error tracking
- Monitor API responses
- Log important events

## 🆘 Support

### Common Issues
1. **Email not sending**: Check Gmail app password
2. **Build failing**: Check ESLint errors
3. **Deployment error**: Check Vercel logs
4. **API errors**: Check backend logs

### Getting Help
- Check Vercel documentation
- Review this deployment guide
- Check GitHub issues
- Contact developer for support

---

**APEX GLITCH CRM Deployment Guide**  
*Last updated: July 2024* 