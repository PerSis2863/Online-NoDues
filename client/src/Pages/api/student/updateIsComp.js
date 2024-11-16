import mysql from 'mysql2';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { rollNumber, isComp } = req.body;

    // Validate input
    if (!rollNumber || typeof isComp !== 'boolean') {
      return res.status(400).json({ message: 'Invalid input. Roll number and isComp are required.' });
    }

    const updateQuery = 'UPDATE requests SET isComp = ? WHERE rollNumber = ?';
    const values = [isComp, rollNumber];

    try {
      const [result] = await connection.promise().query(updateQuery, values);

      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Request not found for the given roll number.' });
      }

      return res.status(200).json({ message: 'Request status updated successfully', success: true });
    } catch (error) {
      console.error('Error updating request:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
