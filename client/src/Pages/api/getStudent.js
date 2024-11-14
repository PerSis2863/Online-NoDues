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
