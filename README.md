# APEX GLITCH CRM

A comprehensive Customer Relationship Management system built with React, Node.js, and SQLite.

## 🚀 Quick Deployment Guide

### Option 1: Vercel (Recommended)

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend:**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Deploy!

#### Backend Deployment (Vercel)

1. **Create vercel.json in backend:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.js"
       }
     ]
   }
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   ```

3. **Update Frontend API URL:**
   - Go to Vercel dashboard
   - Copy your backend URL
   - Update `frontend/src/config.js` with your backend URL

### Option 2: Netlify (Frontend Only)

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=build`

### Option 3: Railway (Full Stack)

1. **Connect GitHub to Railway**
2. **Deploy both frontend and backend**
3. **Set environment variables**

### Option 4: DigitalOcean/AWS (Advanced)

#### DigitalOcean App Platform

1. **Create app in DigitalOcean**
2. **Connect GitHub repository**
3. **Set build commands:**
   - Frontend: `npm run build`
   - Backend: `npm start`

#### AWS Elastic Beanstalk

1. **Package your application**
2. **Upload to S3**
3. **Deploy to Elastic Beanstalk**

## 📁 Project Structure

```
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── config.js  # API configuration
│   │   └── App.js
│   ├── build/         # Production build
│   └── vercel.json    # Vercel configuration
├── backend/           # Node.js API
│   ├── index.js       # Server entry point
│   ├── database.db    # SQLite database
│   └── uploads/       # Document storage
└── README.md
```

## 🔧 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
REACT_APP_UPLOAD_URL=https://your-backend-url.vercel.app
```

### Backend (.env)
```
PORT=3001
NODE_ENV=production
```

## 🚀 Features

- **Customer Management**: Complete CRUD operations
- **Document Upload**: Drag & drop file management
- **Email Communication**: Template-based email system
- **Professional UI**: Material-UI with custom branding
- **Responsive Design**: Works on all devices

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Git

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd apex-glitch-crm
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Start development servers:**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm start

   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🔒 Security Considerations

- Use HTTPS in production
- Implement proper authentication
- Add rate limiting
- Secure file uploads
- Validate all inputs

## 📊 Database Schema

The application uses SQLite with the following tables:
- `customers`: Customer information
- `documents`: File uploads
- `emails`: Email communications

## 🎨 Customization

### Branding
- Update colors in `frontend/src/App.js`
- Change logo in `frontend/src/components/Navbar.js`
- Modify email templates in `frontend/src/components/EmailCommunication.js`

### Features
- Add new customer fields in `backend/index.js`
- Create new document categories in `frontend/src/components/DocumentUpload.js`
- Add email templates in `frontend/src/components/EmailCommunication.js`

## 📞 Support

For deployment issues or questions, please refer to:
- Vercel Documentation: https://vercel.com/docs
- Netlify Documentation: https://docs.netlify.com
- Railway Documentation: https://docs.railway.app

## 📄 License

This project is licensed under the MIT License. 