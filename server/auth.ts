import bcrypt from 'bcryptjs';
import db from './db';

interface DBUser {
  id: number;
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
}

// Create users table if it doesn't exist
db.exec(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`,
  err => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created successfully');
    }
  }
);

export async function createUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username });
          }
        }
      );
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function validateUser(
  username: string,
  password: string
): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get<DBUser>(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          reject(err);
        } else if (!user) {
          resolve(null);
        } else {
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            // Remove password and keep other properties
            const { password: _password, ...userWithoutPassword } = user;
            void _password; // Suppress unused variable warning
            resolve(userWithoutPassword);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

// Create initial admin user if it doesn't exist
createUser('admin', 'admin123').catch(err => {
  if (err.message.includes('UNIQUE constraint failed')) {
    console.log('Admin user already exists');
  } else {
    console.error('Error creating admin user:', err);
  }
});
