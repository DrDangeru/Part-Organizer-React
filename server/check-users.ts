import db from './db';

// Query all users
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error querying users:', err);
  } else {
    console.log('Users in database:', rows);
  }
  process.exit(0);
});
