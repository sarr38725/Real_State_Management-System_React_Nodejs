const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    console.log('🔄 Connecting to MySQL database...');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'real_estate_db',
      port: 3306
    });

    console.log('✅ Database connected successfully\n');

    console.log('📋 Checking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables:', tables);
    console.log('');

    console.log('👤 Checking users...');
    const [users] = await connection.query('SELECT id, email, role FROM users');
    console.log('Users:', users);
    console.log('');

    console.log('🏠 Checking properties...');
    const [properties] = await connection.query('SELECT id, title, agent_id FROM properties');
    console.log('Properties:', properties);
    console.log('');

    if (properties.length > 0) {
      const propertyId = properties[0].id;
      console.log(`🔍 Fetching property with ID ${propertyId}...`);
      const [property] = await connection.query(
        'SELECT * FROM properties WHERE id = ?',
        [propertyId]
      );
      console.log('Property details:', property);
    } else {
      console.log('⚠️ No properties found in database');
    }

    await connection.end();
    console.log('\n✅ Test completed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testDatabase();
