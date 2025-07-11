# APEX GLITCH CRM System

A full-stack Customer Relationship Management (CRM) system built with React frontend and Node.js backend, featuring email notifications, document management, and modern UI.

## 🌟 Features

### Core CRM Features
- **Customer Management**: Complete CRUD operations for customer data
- **Document Upload**: Drag-and-drop file upload with categorized document management
- **Email Communication**: Built-in email system with templates
- **Email Notifications**: Automatic email alerts when forms are completed or documents uploaded
- **Modern UI**: Responsive Material-UI design with professional styling

### Document Categories
- Business Owner ID (Front/Back)
- Business Bank Statements (Monthly)
- Business Tax Returns (Yearly)
- IRS Documents (EIN, SS-4)
- Additional document types

### Email Templates
- Welcome Email
- Credit Application Follow-up
- Document Request
- Approval Notification

## 🚀 Live Deployment

### Production URLs
- **Frontend**: https://frontend-ett6bbhz8-solos-projects-3bdcd80e.vercel.app
- **Backend**: https://backend-qb7z5vugr-solos-projects-3bdcd80e.vercel.app

### GitHub Repository
- **Repository**: https://github.com/S0l0-dev-000/Apex-glicth-crm

## 📁 Project Structure

```
APEX GLITCH CRM/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── config.js        # API configuration
│   │   └── App.js          # Main application
│   ├── vercel.json         # Vercel deployment config
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js API server
│   ├── index.js            # Main server file
│   ├── emailService.js     # SMTP email service
│   ├── db.js              # Database configuration
│   ├── vercel.json        # Vercel deployment config
│   └── package.json       # Backend dependencies
├── deploy.sh              # Deployment script
└── README.md              # This documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - UI framework
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control

## 📧 Email Configuration

### SMTP Setup
The system uses Gmail SMTP for email notifications. Configure your `.env` file in the backend directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com
DB_PATH=./crm.db
PORT=3001
```

### Gmail App Password Setup
1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "APEX GLITCH CRM"
   - Copy the 16-character password (no spaces)
3. Use this password as `EMAIL_PASSWORD` in your `.env` file

### Email Notifications
- **Customer Form Completion**: Sends detailed customer information
- **Document Upload**: Sends document details and customer info
- **HTML Templates**: Professional styling with APEX GLITCH branding

## 🚀 Deployment Guide

### Prerequisites
- Node.js installed
- Vercel CLI installed: `npm install -g vercel`
- GitHub account with repository access

### Step 1: Clone and Setup
```bash
git clone https://github.com/S0l0-dev-000/Apex-glicth-crm.git
cd Apex-glicth-crm
```

### Step 2: Backend Setup
```bash
cd backend
npm install
# Create .env file with your email credentials
vercel --prod
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
# Update config.js with your backend URL
vercel --prod
```

### Step 4: Update Configuration
After deployment, update `frontend/src/config.js` with your new backend URL:

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

## 🔧 Local Development

### Backend Development
```bash
cd backend
npm install
# Create .env file
node index.js
# Server runs on http://localhost:3001
```

### Frontend Development
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### Test Email Service
```bash
cd backend
node test-email.js
```

## 📊 API Endpoints

### Customer Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Document Management
- `POST /api/customers/:id/documents` - Upload document
- `GET /api/customers/:id/documents` - Get customer documents
- `GET /api/documents/:id` - Get single document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/download` - Download document

### Email Communication
- `POST /api/customers/:id/emails` - Send email
- `GET /api/customers/:id/emails` - Get email history
- `DELETE /api/customers/:id/emails/:id` - Delete email

## 🗄️ Database Schema

### Customers Table
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  description TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);
```

### Emails Table
```sql
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template TEXT,
  status TEXT DEFAULT 'pending',
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);
```

## 🔒 Security Features

### File Upload Security
- File type validation (PDF, DOC, DOCX, images, etc.)
- File size limits (10MB max)
- Secure file naming with unique suffixes
- File deletion on document removal

### Email Security
- SMTP authentication
- Environment variable protection
- Non-blocking email sending (won't fail main requests)

## 🎨 UI Components

### Main Components
- **CustomerForm**: Customer information management
- **DocumentUpload**: Drag-and-drop file upload
- **EmailCommunication**: Email composition and history
- **Navbar**: Navigation and branding
- **CustomerList**: Customer overview and management

### Features
- Responsive design for all screen sizes
- Material-UI theming
- Loading states and error handling
- Form validation
- File preview and management

## 🚨 Troubleshooting

### Common Issues

#### Email Not Working
1. Check `.env` file configuration
2. Verify Gmail app password (no spaces)
3. Ensure 2-Step Verification is enabled
4. Test with `node test-email.js`

#### Build Failures
1. Check ESLint errors in frontend
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility

#### Deployment Issues
1. Check Vercel configuration files
2. Verify environment variables
3. Check build logs in Vercel dashboard

#### Database Issues
1. Ensure SQLite file permissions
2. Check database file path in `.env`
3. Verify database schema creation

### Error Messages

#### "Username and Password not accepted"
- Verify Gmail app password format (no spaces)
- Check 2-Step Verification is enabled
- Regenerate app password if needed

#### "Build failed"
- Check ESLint warnings in frontend
- Ensure all imports are correct
- Verify package.json dependencies

#### "Invalid file type"
- Check file upload configuration
- Verify allowed file types in backend
- Ensure file size is under 10MB

## 📈 Future Enhancements

### Planned Features
- User authentication and roles
- Advanced search and filtering
- Reporting and analytics
- Calendar integration
- Mobile app development
- Multi-language support
- Advanced email templates
- Document OCR processing

### Technical Improvements
- Database migration system
- API rate limiting
- Enhanced security measures
- Performance optimization
- Automated testing
- CI/CD pipeline

## 📞 Support

### Contact Information
- **Developer**: S0l0-dev-000
- **Repository**: https://github.com/S0l0-dev-000/Apex-glicth-crm
- **Live Demo**: https://frontend-ett6bbhz8-solos-projects-3bdcd80e.vercel.app

### Documentation Updates
This documentation is maintained with the project. For the latest version, check the GitHub repository.

---

**APEX GLITCH CRM** - Professional Customer Relationship Management System  
*Built with React, Node.js, and deployed on Vercel* 