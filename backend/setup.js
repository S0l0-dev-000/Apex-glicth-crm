const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Admin Setup Server is running!' });
});

// Check if admin exists
app.get('/admin-exists', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ adminExists: row.count > 0 });
  });
});

// Register initial admin
app.post('/register', async (req, res) => {
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
        res.json({ id: this.lastID, email, message: 'Admin account created successfully!' });
      });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Admin Setup Server is running on port ${PORT}`);
});

module.exports = app; 