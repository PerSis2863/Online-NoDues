import bcrypt from 'bcryptjs';
import mysql from 'mysql2';

const dbConfig = {
  host: 'duesbridge-rds.c1wkmaomer43.ap-south-1.rds.amazonaws.com',
  user: 'aditya',
  password: 'Persistivinity2863',
  database: 'nodues',
};

const connection = mysql.createConnection(dbConfig);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, currentPassword, newPassword } = req.body;

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'User ID, current password, and new password are required.' });
    }

    // Check the strength of the new password (minimum length example)
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    try {
      // Get the user's current hashed password from the database
      const [rows] = await connection.promise().query('SELECT password FROM users WHERE id = ?', [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const storedPasswordHash = rows[0].password;

      // Compare the current password with the stored hash
      const isPasswordCorrect = await bcrypt.compare(currentPassword, storedPasswordHash);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      // Hash the new password before saving it
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      await connection.promise().query('UPDATE users SET password = ? WHERE id = ?', [newPasswordHash, userId]);

      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
