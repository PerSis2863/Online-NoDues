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
    const { rollNumber } = req.body;

    const sqlQuery = "SELECT * FROM students WHERE rollNumber = ?";
    const values = [rollNumber];

    try {
      const [results] = await connection.promise().query(sqlQuery, values);

      if (results.length === 0) {
        return res.status(401).json({ message: "Student not found" });
      }

      return res.status(200).json(results[0]);
    } catch (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
