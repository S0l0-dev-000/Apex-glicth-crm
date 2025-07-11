const bcrypt = require('bcrypt');
const db = require('./db');

async function createAdmin(email, password) {
  if (!email || !password) {
    console.error('Usage: node create-admin.js <email> <password>');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      console.error(`❌ User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
        [email, hashedPassword, 'admin'], 
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🆔 Role: admin`);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node create-admin.js <email> <password>');
  console.error('Example: node create-admin.js admin@yourcompany.com mypassword123');
  process.exit(1);
}

createAdmin(args[0], args[1]); 