const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./db');
const { sendCustomerNotification, sendDocumentNotification } = require('./emailService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow PDF, DOC, DOCX, images, and other common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, images, and common document types are allowed.'), false);
    }
  }
});

app.get('/', (req, res) => {
  res.send('CRM Backend is running!');
});

// Public endpoint - Check if admin exists
app.get('/admin-exists', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ adminExists: row.count > 0 });
  });
});

// Check if admin exists (alternative endpoint)
app.get('/api/admin-exists', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ adminExists: row.count > 0 });
  });
});

// GET all customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single customer
app.get('/api/customers/:id', (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

// POST new customer
app.post('/api/customers', async (req, res) => {
  const customerData = req.body;
  
  if (!customerData.name || !customerData.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Get all fields from the request body
  const fields = Object.keys(customerData);
  const values = Object.values(customerData);
  const placeholders = fields.map(() => '?').join(', ');

  const query = `INSERT INTO customers (${fields.join(', ')}) VALUES (${placeholders})`;

  db.run(query, values, async function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Send email notification
    try {
      await sendCustomerNotification(customerData);
      console.log('Customer notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending customer notification email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ id: this.lastID, ...customerData });
  });
});

// PUT update customer
app.put('/api/customers/:id', (req, res) => {
  const customerData = req.body;
  
  if (!customerData.name || !customerData.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Get all fields from the request body
  const fields = Object.keys(customerData);
  const values = Object.values(customerData);
  const setClause = fields.map(field => `${field} = ?`).join(', ');

  const query = `UPDATE customers SET ${setClause} WHERE id = ?`;

  db.run(query, [...values, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ id: req.params.id, ...customerData });
  });
});

// DELETE customer
app.delete('/api/customers/:id', (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// File Upload Endpoints

// POST upload document
app.post('/api/customers/:id/documents', upload.single('document'), async (req, res) => {
  const customerId = req.params.id;
  const { category, description } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const documentData = {
    customer_id: customerId,
    filename: req.file.filename,
    original_filename: req.file.originalname,
    file_path: req.file.path,
    file_size: req.file.size,
    file_type: req.file.mimetype,
    category: category || 'General',
    description: description || ''
  };

  const query = `INSERT INTO documents (customer_id, filename, original_filename, file_path, file_size, file_type, category, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [
    documentData.customer_id,
    documentData.filename,
    documentData.original_filename,
    documentData.file_path,
    documentData.file_size,
    documentData.file_type,
    documentData.category,
    documentData.description
  ], async function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Send email notification for document upload
    try {
      // Get customer data for the email
      db.get('SELECT * FROM customers WHERE id = ?', [customerId], async (customerErr, customer) => {
        if (!customerErr && customer) {
          await sendDocumentNotification(customer, documentData);
          console.log('Document notification email sent successfully');
        }
      });
    } catch (emailError) {
      console.error('Error sending document notification email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ 
      id: this.lastID, 
      ...documentData,
      message: 'Document uploaded successfully' 
    });
  });
});

// GET all documents for a customer
app.get('/api/customers/:id/documents', (req, res) => {
  const customerId = req.params.id;
  
  db.all('SELECT * FROM documents WHERE customer_id = ? ORDER BY uploaded_at DESC', [customerId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single document
app.get('/api/documents/:id', (req, res) => {
  db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.json(row);
  });
});

// DELETE document
app.delete('/api/documents/:id', (req, res) => {
  db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, document) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Delete file from filesystem
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    // Delete from database
    db.run('DELETE FROM documents WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Document deleted successfully' });
    });
  });
});

// Download document
app.get('/api/documents/:id/download', (req, res) => {
  db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, document) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const filePath = document.file_path;
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found on server' });
      return;
    }

    res.download(filePath, document.original_filename);
  });
});

// Register endpoint (for initial admin setup)
app.post('/api/register', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  const { email, password, secretCode } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Check secret code
  const adminSecretCode = process.env.ADMIN_SECRET_CODE || 'lance';
  if (!secretCode || secretCode !== adminSecretCode) {
    return res.status(403).json({ error: 'Invalid secret code' });
  }
  
  // Check if any admin already exists
  db.get('SELECT * FROM users WHERE role = ?', ['admin'], async (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (admin) return res.status(403).json({ error: 'Admin registration is disabled. An admin already exists.' });
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (user) return res.status(400).json({ error: 'User already exists' });
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin'], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, email });
      });
    });
  });
});

// Register endpoint (for regular users)
app.post('/api/register-user', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  // Check if user already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user) return res.status(400).json({ error: 'User already exists' });
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'user'], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, email, role: 'user' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  });
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Protect customer and document routes (but not admin setup routes)
app.use('/api/customers', authenticateToken);
app.use('/api/documents', authenticateToken);

// Change password endpoint (admin or user)
app.post('/api/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Password updated successfully' });
    });
  });
});

// Change email endpoint (admin or user)
app.post('/api/change-email', authenticateToken, async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail) {
    return res.status(400).json({ error: 'New email is required' });
  }
  // Check if email already exists
  db.get('SELECT * FROM users WHERE email = ?', [newEmail], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user) return res.status(400).json({ error: 'Email already in use' });
    db.run('UPDATE users SET email = ? WHERE id = ?', [newEmail, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Email updated successfully', newEmail });
    });
  });
});

// Create new admin (only for logged-in admins)
app.post('/api/create-admin', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create other admins.' });
  }
  const { email, password, secretCode } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Check secret code
  const adminSecretCode = process.env.ADMIN_SECRET_CODE || 'lance';
  if (!secretCode || secretCode !== adminSecretCode) {
    return res.status(403).json({ error: 'Invalid secret code' });
  }
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user) return res.status(400).json({ error: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin'], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, email, role: 'admin' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 