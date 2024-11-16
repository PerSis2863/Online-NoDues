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

    const sqlQuery = `UPDATE requests SET ${section} = ? WHERE rollNumber = ?`;
    const values = [value, rollNumber];

    try {
      await connection.promise().query(sqlQuery, values);
      return res.status(200).json({ message: 'Section updated successfully' });
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
