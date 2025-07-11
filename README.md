# 🚀 APEX GLITCH CRM

A comprehensive Customer Relationship Management system built with React and Node.js.

## ⚡ Quick Start (Recommended for Admin Setup)

Since the production backend has Vercel authentication enabled, use local development for admin creation:

### 🖥️ Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/S0l0-dev-000/Apex-glicth-crm.git
cd Apex-glicth-crm

# 2. Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# 3. Start backend (Terminal 1)
cd backend
node index.js

# 4. Start frontend (Terminal 2)
cd frontend
npm start
```

### 🔑 Create Admin Account

**Option 1: CLI Tool (Easiest)**
```bash
cd backend
node create-admin.js admin@yourcompany.com yourpassword123
```

**Option 2: Web Interface**
1. Go to `http://localhost:3000`
2. Use secret code: `lance`
3. Create your admin account

### 🌐 Production URLs (For Reference)

- **Frontend:** `https://frontend-u5vsalish-solos-projects-3bdcd80e.vercel.app`
- **Backend:** `https://backend-kmzuy37h4-solos-projects-3bdcd80e.vercel.app`

*Note: Production backend requires Vercel authentication. For full functionality, use local development.*

## 📋 Features

- **👥 Customer Management** - Add, edit, and manage customer information
- **📎 Document Upload** - Attach files and documents to customer records
- **📧 Email Integration** - Send automated notifications
- **🔐 Admin System** - Secure authentication and user management
- **📊 Business Intelligence** - Comprehensive customer data tracking

## 🛠️ Tech Stack

- **Frontend:** React, Material-UI, Axios
- **Backend:** Node.js, Express, SQLite
- **Authentication:** JWT
- **File Storage:** Local uploads with database tracking
- **Email:** SMTP integration

## 📚 Database Schema

### Customers Table
Comprehensive customer information including:
- Personal details (name, email, phone)
- Business information (company, industry, revenue)
- Financial data (credit scores, payment history)
- Communication preferences

### Users Table
- Secure admin authentication
- Role-based access control

### Documents Table
- File upload tracking
- Customer association
- Metadata storage

## 🔧 Environment Configuration

Create `.env` file in backend directory:
```env
# SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@yourcompany.com

# Admin Configuration
ADMIN_SECRET_CODE=lance

# Database Configuration
DB_PATH=./crm.db

# Server Configuration
PORT=3001

# JWT Secret
JWT_SECRET=your-jwt-secret
```

## 🚀 Deployment

### Backend (Vercel)
```bash
cd backend
vercel --prod
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

*Update frontend config with your backend URL after deployment.*

## 📖 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Made with ❤️ for better customer relationship management** 