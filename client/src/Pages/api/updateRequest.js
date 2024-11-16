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
    const { rollNumber, section, value } = req.body;

    // Validate input
    if (!rollNumber || !section || value === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure the section exists in the `requests` table
    const validSections = [
      'deplabs', 'commonlabs', 'accounts', 'exam', 'library',
      'deplib', 'store', 'tpc'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }

    // Construct the SQL query to update the section
    const sqlQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
    const values = [value, rollNumber];

    try {
      const [result] = await connection.promise().query(sqlQuery, values);

      // Check if any rows were affected (i.e., student exists)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Student not found or no change made' });
      }

      return res.status(200).json({ message: 'Request updated successfully' });
    } catch (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // If the HTTP method is not POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
