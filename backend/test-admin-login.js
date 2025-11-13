const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...\n');

    const email = 'admin@realestate.com';
    const password = 'admin123';

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      console.log('❌ Admin user not found in database!');
      console.log('Creating admin user...\n');

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, 'Admin User', 'admin']
      );

      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@realestate.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    const user = users[0];
    console.log('Admin user found:');
    console.log('- ID:', user.id);
    console.log('- Email:', user.email);
    console.log('- Name:', user.full_name);
    console.log('- Role:', user.role);
    console.log('- Password Hash:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('\n✅ Password verification PASSED!');
      console.log('Admin login should work correctly.');
    } else {
      console.log('\n❌ Password verification FAILED!');
      console.log('Updating password...');

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

      console.log('✅ Password updated successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAdminLogin();
